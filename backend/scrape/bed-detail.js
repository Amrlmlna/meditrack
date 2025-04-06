const { scrapeSite } = require("../utils/scrape-site");

const getBedDetail = async (hospitalid, type) => {
  const { $, status } = await scrapeSite(
    `/tempat_tidur?kode_rs=${hospitalid}&jenis=${type}`
  );
  const bedDetail = [];

  const address = $(".col-11.col-md-11 > p > small:nth-child(2)").text().trim();
  const phone =
    $(".col-11.col-md-11 > p > small:nth-child(4)").text().trim() || null;
  const name = $(".col-11.col-md-11 > p")
    .text()
    .trim()
    .replace(address, "")
    .replace(phone, "")
    .trim();

  $(".col-md-12.mb-2 ").each((_, el) => {
    const time = $(el)
      .find(
        ".card > .card-body > .row > .col-md-6.col-12:nth-child(1) > p.mb-0 > small"
      )
      .text()
      .trim()
      .replace("Update", "");
    const title = $(el)
      .find(
        ".card > .card-body > .row > .col-md-6.col-12:nth-child(1) > p.mb-0"
      )
      .text()
      .trim()
      .replace(time, "")
      .replace("Update", "")
      .trim();
    const bedAvailable = +$(el)
      .find(
        ".card > .card-body > .row > .col-md-6.col-12:nth-child(2)  .col-md-4.col-4:nth-child(1) > div.text-center.pt-1.pb-1 > div:nth-child(2)"
      )
      .text()
      .trim();
    const bed_empty = +$(el)
      .find(
        ".card > .card-body > .row > .col-md-6.col-12:nth-child(2) .col-md-4.col-4:nth-child(2) > div.text-center.pt-1.pb-1 > div:nth-child(2)"
      )
      .text()
      .trim();
    const queueBed = +$(el)
      .find(
        ".card > .card-body > .row > .col-md-6.col-12:nth-child(2) .col-md-4.col-4:nth-child(3) > div.text-center.pt-1.pb-1 > div:nth-child(2)"
      )
      .text()
      .trim();

    bedDetail.push({
      time,
      stats: {
        title,
        bed_available: bedAvailable,
        bed_empty,
        queue: queueBed,
      },
    });
  });

  return {
    status: status,
    data: {
      id: hospitalid,
      name,
      address,
      phone,
      bedDetail,
    },
  };
};

module.exports = { getBedDetail };
