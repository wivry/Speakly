// zde jsou definované adresy pro verze debug a pro production na noel.fel.cvut.cz/sredemo

const DEBUG = true;

export const url_basename = DEBUG ? "/" : "/sredemo";
export const url_pageAddRecord = DEBUG ? "/addrecord/" : "/sredemo/addrecord/";
export const url_pageAnalyze = DEBUG ? "/analyze/" : "/sredemo/analyze/";
export const url_api = DEBUG
  ? "/api/create-record"
  : "/sredemo/api/create-record";
