const HttpError = require("../../../utils/error/HttpError");
const { Service } = require("../../../models/Service");
const { Mandataire } = require("../../../models/Mandataire");

async function checkEnqueteContext(req) {
  const { role, userId: authUserId } = req.user;

  const inputParameters = req.body.input;

  const { enqueteId, userId } = inputParameters;

  if (!userId) {
    throw new HttpError(422, "Invalid parameters: 'userId' is required");
  }

  const context = {
    role,
    enqueteId,
    userId,
    service: undefined,
    mandataire: undefined,
  };

  if (role === "service") {
    // SERVICE
    if (userId !== authUserId) {
      throw new HttpError(403, "Access denied: invalid serviceId");
    }
    context.service = await Service.query().findOne({
      user_id: userId,
    });
    throw new HttpError(400, "Not supported yet (service)");
  } else if (role === "individuel") {
    // MANDATAIRE INDIVIDUEL
    if (userId !== authUserId) {
      throw new HttpError(403, "Access denied: invalid 'userId'");
    }
    context.mandataire = await Mandataire.query().findOne({
      user_id: userId,
    });
  } else if (role === "prepose") {
    // MANDATAIRE PREPOSE
    if (userId !== authUserId) {
      throw new HttpError(403, "Access denied: invalid 'userId'");
    }
    context.mandataire = await Mandataire.query().findOne({
      user_id: userId,
    });
  } else {
    throw new HttpError(403, "Invalid user");
  }

  return context;
}

module.exports = checkEnqueteContext;