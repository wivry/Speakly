// zde jsou definované adresy pro verze debug a pro production na noel.fel.cvut.cz/sredemo

const DEBUG = false;

export const url_basename = DEBUG ? "/" : "/sredemo";
export const url_pageAddRecord = DEBUG ? "/addrecord/" : "/sredemo/addrecord/";
export const url_pageAnalyze = DEBUG ? "/analyze/" : "/sredemo/analyze/";
export const url_create_record = DEBUG
  ? "/api/create-record"
  : "/sredemo/api/create-record";
export const url_sentence = DEBUG
  ? "/api/RandomSentence"
  : "/sredemo/api/RandomSentence";
export const url_analyze_record = DEBUG
  ? "/api/analyze-record"
  : "/sredemo/api/analyze-record";
