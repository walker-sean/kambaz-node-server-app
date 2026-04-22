import { quizAttemptModel, quizModel } from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function QuizzesDao() {
    async function findQuizzesForCourse(courseId) {
        return await quizModel.find({ course: courseId });
    };

    async function createQuiz(quiz) {
        return await quizModel.create({...quiz, _id: uuidv4()})
    };

    async function deleteQuiz(quizId) {
        return await quizModel.findByIdAndDelete(quizId);
    };

    async function updateQuiz(quizId, quizUpdates) {
        if (quizUpdates.questions) {
            quizUpdates.questions = quizUpdates.questions.map(question => ({
                ...question,
                _id: question._id || uuidv4(),
                choices: question.choices?.map(choice => ({
                    ...choice,
                    _id: choice._id || uuidv4(),
                })),
            }));
        }
        return await quizModel.findByIdAndUpdate(quizId, quizUpdates);    
    }

    async function findQuizById(quizId) {
        return await quizModel.findById(quizId);
    }

    async function addQuestionToQuiz(quizId, question) {
        return await quizModel.findByIdAndUpdate(quizId, { $push: { questions: question}})
    }

    async function updateQuestion(quizId, questionId, questionUpdates) {
        const quiz = await quizModel.findById(quizId);
        const question = quiz.questions.id(questionId);
        Object.assign(question, questionUpdates);
        await quiz.save();
        return question;
    }

    async function deleteQuestionFromQuiz(quizId, questionId) {
        return await quizModel.findByIdAndUpdate(quizId, { $pull: {questions: {_id: questionId}}})
    }

    async function findQuizAttemptsByUser(quizId, userId) {
        return await (quizAttemptModel.find({ quiz: quizId, taker: userId}).sort( { attemptNumber: -1 }))
    }

    async function findLastQuizAttempt(quizId, userId) {
        return await (quizAttemptModel.findOne({ quiz: quizId, taker: userId}).sort({attemptNumber: -1 }))
    }

    async function getNumberOfQuizAttempts(quizId, userId) {
        return await quizAttemptModel.countDocuments( { quiz: quizId, taker: userId});
    }

    async function makeAttempt(attempt) {
        const { quiz: quizId, answers, taker: takerId } = attempt;
        const quiz = await findQuizById(quizId);
        if (!quiz) {
            throw new Error('No quiz found');
        }
        const attemptNumber = await getNumberOfQuizAttempts(quizId, takerId) + 1;

        const { multipleAttempts, howManyAttempts } = quiz;
        if (attemptNumber > howManyAttempts || (attemptNumber > 1 && !multipleAttempts)) {
            throw new Error('Already hit max attempts');
        }
        let earnedPoints = 0;


        // calculate the number of earned points
        answers.forEach(answer => {
            const { questionId, response } = answer;
            const question = quiz.questions.id(questionId);
            if (!question) return;
            const { type: questionType, points, choices, correctAnswer, correctResponses } = question;
            switch (questionType) {
                case 'MULTIPLE_CHOICE':
                    const chosenChoice = choices.id(response);
                    if (chosenChoice.isCorrect) {
                        earnedPoints += points;
                    }
                    break;
                case 'TRUE_OR_FALSE':
                    if (correctAnswer === response) {
                        earnedPoints += points;
                    }
                    break;
                case 'FILL_IN_THE_BLANK':
                    if (correctResponses.map(cr => cr.toLowerCase()).includes(response.toLowerCase())) {
                        earnedPoints += points;
                    }
            }
        });


        return await quizAttemptModel.create({ ...attempt, _id: uuidv4(), score: earnedPoints, attemptNumber });
    };

    async function findCourseQuizAttemptsByUser(courseId, userId) {
        return await quizAttemptModel.find({ course: courseId, user: userId});
    }

    return {
        findQuizzesForCourse,
        createQuiz,
        deleteQuiz,
        updateQuiz,
        findQuizById,
        addQuestionToQuiz,
        updateQuestion,
        deleteQuestionFromQuiz,
        findQuizAttemptsByUser,
        findLastQuizAttempt,
        makeAttempt,
        findCourseQuizAttemptsByUser
    }
}