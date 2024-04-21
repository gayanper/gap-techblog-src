const fs = require("fs");
const path = require("path");

const demographicData = JSON.parse(
  fs.readFileSync(
    path.resolve("/docker-entrypoint-initdb.d/demographic_data.json"),
    "utf-8"
  )
);

const diagnosisData = JSON.parse(
  fs.readFileSync(
    path.resolve("/docker-entrypoint-initdb.d/patient_diagnosis_data.json"),
    "utf-8"
  )
);

db = connect("mongodb://localhost:27017/dstats");
db.dentries.insertMany(diagnosisData);
db.demographics.insertMany(demographicData);
