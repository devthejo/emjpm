const express = require("express");
const { isEnAttente } = require("@emjpm/core");
const { getEmailUserDatas } = require("../../../email/email-user-data");
const { reservationEmail } = require("../../../email/reservation-email");
const { Tis } = require("../../../models/Tis");
const { Mesure } = require("../../../models/Mesure");

const router = express.Router();

router.post("/email-reservation", async function (req, res) {
  const { mesure_id } = req.body.input;

  const mesure = await Mesure.query().findById(mesure_id);
  const { ti_id, service_id, mandataire_id, status } = mesure;

  if (isEnAttente({ status })) {
    const ti = await Tis.query().findById(ti_id);
    const users = await getEmailUserDatas(mandataire_id, service_id);
    const emails = users.map((user) => reservationEmail(ti, mesure, user));

    await Promise.all(emails);
  }

  res.json({ success: true });
});

module.exports = router;