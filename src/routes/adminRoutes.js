const express = require("express");

const {
    getAdminContent,
    createAdminContent,
    updateAdminContent,
    deleteAdminContent,

    getCoachingMessages,
    createCoachingMessage,

    getOnboardingQuestions,
    createOnboardingQuestion,

    getPersonalizationRules,
    createPersonalizationRule,

    getScreeningGuidance,
    createScreeningGuidance,
    updateScreeningGuidance,
    deleteScreeningGuidance
} = require("../controllers/adminController");

const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();


/*
========================================================
EDUCATIONAL CONTENT
========================================================
*/

router.get(
    "/content",
    requireAdmin,
    getAdminContent
);

router.post(
    "/content",
    requireAdmin,
    createAdminContent
);

router.put(
    "/content/:id",
    requireAdmin,
    updateAdminContent
);

router.delete(
    "/content/:id",
    requireAdmin,
    deleteAdminContent
);


/*
========================================================
COACHING MESSAGES
========================================================
*/

router.get(
    "/coaching-messages",
    requireAdmin,
    getCoachingMessages
);

router.post(
    "/coaching-messages",
    requireAdmin,
    createCoachingMessage
);


/*
========================================================
ONBOARDING QUESTIONS
========================================================
*/

router.get(
    "/onboarding-questions",
    requireAdmin,
    getOnboardingQuestions
);

router.post(
    "/onboarding-questions",
    requireAdmin,
    createOnboardingQuestion
);


/*
========================================================
PERSONALIZATION RULES
========================================================
*/

router.get(
    "/personalization-rules",
    requireAdmin,
    getPersonalizationRules
);

router.post(
    "/personalization-rules",
    requireAdmin,
    createPersonalizationRule
);


/*
========================================================
SCREENING GUIDANCE
========================================================
*/

router.get(
    "/screening-guidance",
    requireAdmin,
    getScreeningGuidance
);

router.post(
    "/screening-guidance",
    requireAdmin,
    createScreeningGuidance
);

router.put(
    "/screening-guidance/:id",
    requireAdmin,
    updateScreeningGuidance
);

router.delete(
    "/screening-guidance/:id",
    requireAdmin,
    deleteScreeningGuidance
);


module.exports = router;