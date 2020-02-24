'use strict';

/** @member {Object} */
const chalk = require(`chalk`);
const http = require(`http`);
const fs = require(`fs`).promises;

const DEFAULT_PORT = 3000;
const FILENAME = `mock.json`;

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const sendResponse = (res, statusCode, message) => {
      const template = `
        <!doctype html>
          <html lang="ru">
          <head>
            <title>With love from Node</title>
          </head>
          <body>${message}</body>
        </html>
      `.trim();

      res.statusCode = statusCode;
      res.writeHead(statusCode, {
        'Content-Type': `text/html; charset=UTF-8`,
      });

      res.end(template);
    };

    const onClientConnect = async (req, res) => {
      const notFoundMessageText = `Not found`;

      switch (req.url) {
        case `/`:
          try {
            const fileContent = await fs.readFile(FILENAME, `utf-8`);
            const mocks = JSON.parse(fileContent);
            const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);
            sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
          } catch (err) {
            sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          }
          break;
        default:
          sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
          break;
      }
    };

    http.createServer(onClientConnect).listen(port).on(`listening`, (err) => {
      if (err) {
        return console.error(`Ошибка при создании сервера`, err);
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
