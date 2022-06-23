const chalk = require('chalk');
const moment = require('moment');
const util = require('util');


module.exports = class Logger {
  constructor(RID, reqStartTime, reqEndTime, logGroupName) {
    this.RID = RID;
    this.reqStartTime = reqStartTime;
    this.reqEndTime = reqEndTime;
    this.logGroup = logGroupName;
  }


  log(logText, logData) {
    if (!this.logGroup) {
      console.log(`${this._getLogHeader()} [INFO] ${logText}`, util.inspect(logData || ''));
    }
    else {
      console.log(`${this._getLogHeader()} [INFO] ${chalk.bold(`[${this.logGroup}]`)}  ${logText}`, util.inspect(logData || ''));
    }
  }


  getContextualLogger(logGroupName) {
    return new Logger(this.RID, this.reqStartTime, this.reqEndTime, logGroupName);
  }


  logRequest(req) {
    this.reqStartTime = moment().unix();

    const requestMethod = req.method;
    const requestPath = req.path;

    console.log(`${this._getLogHeader()} ${chalk.bold(`INICIANDO REQUEST      ${requestMethod} ${requestPath}`)}`);
  }


  logResponse(req, res) {
    this.reqEndTime = moment().unix();

    const requestMethod = req.method;
    const requestPath = req.path;
    const requestTotalTime = this.reqEndTime - this.reqStartTime;
    let requestStatusCode = res.statusCode;

    if (requestStatusCode < 400) {
      requestStatusCode = `${chalk.green(requestStatusCode)}`;
    }
    else {
      requestStatusCode = `${chalk.red(requestStatusCode)}`;
    }

    console.log(`${this._getLogHeader()} ${chalk.bold(`FINALIZANDO REQUEST    ${requestMethod} ${requestPath} ${requestStatusCode} ${requestTotalTime}ms`)}`);
  }


  _getLogHeader() {
    return `${this._timeStamp()}   ${this._requestId()}     `;
  }


  _timeStamp() {
    const timestamp = `[${moment().format()}]`;

    return chalk.inverse(timestamp);
  }


  _requestId() {
    return chalk.bgBlack.white.bold(this.RID);
  }
};