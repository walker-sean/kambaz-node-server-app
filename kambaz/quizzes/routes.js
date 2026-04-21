import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
    const dao = QuizzesDao();

    const findQuizzesForCourse = async (req, res) => {
        const { courseId} = req.params;
        const quizzes = await dao.findQuizzesForCourse(courseId);
        res.json(quizzes);
    } 

    const createQuiz = async (req, res) => {
        const quiz = req.body;
        const newQuiz = await dao.createQuiz(quiz);
        res.json(newQuiz);
    }

    const findQuizById = async (req, res) => {
        const { quizId } = req.params;
        const quiz =  await dao.findQuizById(quizId);
        res.json(quiz);
    }

    const updateQuiz = async (req, res) => {
        const { quizId } = req.params;
        const updatedQuiz = req.body;
        const quiz = await dao.updateQuiz(quizId, updatedQuiz);
        res.json(quiz);
    };

    const deleteQuiz = async (req, res) => {
        const { quizId } = req.params;
        await dao.deleteQuiz(quizId);
        res.sendStatus(200);
    }

    const addQuestionToQuiz = async (req, res) => {
        const { quizId } = req.params;
        const question = req.body;
        const updatedQuiz = await dao.addQuestionToQuiz(quizId, question);
        res.json(updatedQuiz);
    };

    const updateQuizQuestion = async (req, res) => {
        const { quizId, questionId } = req.params;
        const updatedQuestion = req.body;
        const question = await dao.updateQuestion(quizId, questionId, updatedQuestion);
        res.json(question);
    };

    const deleteQuizQuestion = async (req, res) => {
        const { quizId, questionId} = req.params;
        await dao.deleteQuestionFromQuiz(quizId, questionId);
        res.sendStatus(200);
    }

    const makeAttempt = async (req, res) => {
        const attempt= req.body;
        try {
            const madeAttempt = await dao.makeAttempt(attempt);
            res.json(madeAttempt);
        } catch {
            res.sendStatus(403);
        }
    }

    const findQuizAttempts = async (req, res) => {
        const { quizId } = req.params;
        const { currentUser: { _id: currentUserId } } = req.session;
        if (!currentUserId) {
            return res.sendStatus(401);
        }
        const attempts = await dao.findQuizAttemptsByUser(quizId, currentUserId);
        res.json(attempts);
    }

    const findLastQuizAttempt = async (req, res) => {
        const { quizId } = req.params;
        const { currentUser: { _id: currentUserId}} = req.session;
        if (!currentUserId) {
            return res.sendStatus(401);
        }
        const attempt = await dao.findLastQuizAttempt(quizId, currentUserId);
        res.json(attempt);
    }

    const findCourseQuizAttempts = async (req, res) => {
        const { courseId } = req.params;
        const { currentUser: { _id: currentUserId }} = req.session;
        if (!currentUserId) {
            return res.sendStatus(401);
        }
        const attempts = await dao.findCourseQuizAttemptsByUser(courseId, currentUserId);
        res.json(attempts);
    }

    app.get('/api/courses/:courseId/quizzes', findQuizzesForCourse);
    app.post('/api/quizzes', createQuiz);
    app.get('/api/quizzes/:quizId', findQuizById);
    app.put('/api/quizzes/:quizId', updateQuiz);
    app.delete('/api/quizzes/:quizId', deleteQuiz);
    app.post('/api/quizzes/:quizId/questions', addQuestionToQuiz);
    app.put('/api/quizzes/:quizId/questions/:questionId', updateQuizQuestion);
    app.delete('/api/quizzes/:quizId/questions/:questionId', deleteQuizQuestion);
    app.post('/api/quizzes/:quizId/attempts', makeAttempt);
    app.get('/api/quizzes/:quizId/attempts', findQuizAttempts);
    app.get('/api/quizzes/:quizId/attempts/last', findLastQuizAttempt);
    app.get('/api/courses/:courseId/attempts', findCourseQuizAttempts);
}