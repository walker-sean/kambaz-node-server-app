import mongoose, { Schema } from "mongoose";

const choiceSchema = new mongoose.Schema({
    _id: String,
    text: String,
    isCorrect: Boolean
}, { collection: 'choices' });

const questionSchema = new mongoose.Schema({
    _id: String,
    title: String,
    type: {
        type: String,
        enum: ['MULTIPLE_CHOICE', 'TRUE_OR_FALSE', 'FILL_IN_THE_BLANK'],
        default: 'MULTIPLE_CHOICE'
    },
    points: Number,
    question: String,
    choices: [choiceSchema],
    correctAnswer: Boolean,
    correctResponses: [String]
},
{ collection: 'questions' }
);

export const quizSchema = new mongoose.Schema({
    _id: String,
    title: String,
    course: {
        type: String,
        ref: 'CourseModel'
    },
    description: String,
    quizType: {
        type: String,
        enum: ['GRADED_QUIZ', 'PRACTICE', 'GRADED_SURVEY', 'UNGRADED_SURVEY'],
        default: 'GRADED_QUIZ'
    },
    assignmentGroup: {
        type: String,
        enum: ['QUIZZES', 'EXAMS', 'ASSIGNMENTS', 'PROJECTS'],
        default: 'QUIZZES'
    },
    shuffleAnswers: {
        type: Boolean,
        default: true
    },
    timeLimit: {
        type: Number,
        default: 20
    },
    multipleAttempts: {
        type: Boolean,
        default: false
    },
    howManyAttempts: {
        type: Number,
        default: 1
    },
    showCorrectAnswers: {
        type: Boolean,
        default: false
    },
    accessCode: {
        type: String,
        default: ''
    },
    oneQuestionAtATime: {
        type: Boolean,
        default: true
    },
    webcamRequired: {
        type: Boolean,
        default: false
    },
    lockQuestionsAfterAnswering: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 // 1 week from now
    },
    availableDate: {
        type: Date,
        default: Date.now
    },
    untilDate: {
        type: Date,
        default: () => Date.now() + 7 * 24 * 60 * 60 * 1000
    },
    published: {
        type: Boolean,
        default: false
    },
    questions: [questionSchema]
}, { collection: 'quizzes' });

const answerSchema = new mongoose.Schema({
    questionId: String,
    response: {
        type: Schema.Types.Mixed
    }
}, {collection: 'answers' });

export const quizAttemptSchema = new mongoose.Schema({
    _id: String,
    quiz: {
        type: String,
        ref: 'QuizModel'
    },
    taker: {
        type: String,
        ref: 'UserModel'
    },
    answers: [answerSchema],
    score: Number,
    possiblePoints: Number,
    attemptNumber: Number,
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, { collection: 'attempts' });