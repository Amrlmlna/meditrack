const { scrapeSite } = require("../utils/scrape-site");
const { capitalizeStr } = require("../utils/capitalize-str");

const removeDuplicateItems = (arr) => {
  const setValue = new Set();

  return arr.filter((data) => {
    const isInSet = setValue.has(data.id);
    setValue.add(data.id);
    return !isInSet;
  });
};

const getHospitalList = async ({ type, provinceid, cityid }) => {
  const { $, status } = await scrapeSite(
    `rumah_sakit?jenis=${type}&propinsi=${provinceid}&kabkota=${cityid}`
  );

  const RE_NUMBER = /\d/;
  let hospitals = [];

  $(".row > .cardRS").each((_, el) => {
    const beds = [];

    const name = $(el).data("string");
    const getPhone =
      $(el).find(".card-footer > div > span").text().trim().replace(" ", "") ??
      null;
    const getAddress = $(el)
      .find(
        `${type == 1 ? ".card-body .col-md-7 > p" : ".card-body .col-md-5 > p"}`
      )
      .text()
      .trim();
    const bed_availability = +$(el)
      .find(".card-body .col-md-5 > p > b")
      .text()
      .trim();
    const getInfo =
      type == 1
        ? $(el).find(".card-body .col-md-5 > p:nth-child(4)").text().trim()
        : $(el)
            .find(
              ".card-body .col-md-7 .col-md-4:nth-child(1) .card-footer > .text-center"
            )
            .text()
            .trim();
    const getId = $(el).find(".card-footer > div > a").attr("href");
    const getQueue = $(el)
      .find(".card-body .col-md-5 > p:nth-child(3)")
      .text()
      .trim();

    const parsed = new URLSearchParams(getId);
    const id = parsed.values().next().value;
    const phone =
      getPhone !== "hotlinetidak tersedia" ? getPhone.replace("-", "") : null;
    const address = getAddress !== "" ? getAddress : null;
    const info = getInfo !== "" ? capitalizeStr(getInfo) : null;
    const queue = RE_NUMBER.test(getQueue)
      ? +getQueue.replace(/[^\d]/gi, " ")
      : 0;

    if (type == 2) {
      $(el)
        .find(".card")
        .each((_, el) => {
          const bedClass = $(el)
            .find(
              "div.card-body > div > div.col-md-7 > div > div > table > tbody:nth-child(1) > tr > td:nth-child(1)"
            )
            .text()
            .trim();
          const roomName = $(el)
            .find(
              "div.card-body > div > div.col-md-7 > div > div > table > tbody:nth-child(1) > tr > td:nth-child(2)"
            )
            .text()
            .trim();
          const totalBeds = +$(el)
            .find(
              "div.card-body > div > div.col-md-7 > div > div > table > tbody:nth-child(1) > tr > td:nth-child(3)"
            )
            .text()
            .trim()
            .replace("Tersedia", "")
            .replace("bed kosong", "");
          const info = capitalizeStr(
            $(el)
              .find(
                "div.card-body > div > div.col-md-7 > div > div > table > tbody:nth-child(1) > tr > td:nth-child(4)"
              )
              .text()
              .trim()
          );
          beds.push({
            available: totalBeds,
            bed_class: bedClass,
            room_name: roomName,
            info,
          });
        });
      hospitals.push({
        id,
        name,
        address,
        phone,
        available_beds: beds,
      });
    } else {
      hospitals.push({
        id,
        name,
        address,
        phone,
        queue,
        bed_availability,
        info,
      });
    }
  });

  return {
    status,
    hospitals: removeDuplicateItems(hospitals),
  };
};

module.exports = {
  getHospitalList,
};
