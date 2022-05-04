'use strict'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colorizeJSON = (obj, theme = 'light') => {
  const jsonLine = /^( *)("[@]?[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;

  const isJsonString = (val) => val[0] === '"'

  const removeColon = (val) => val.replace(/[: ]/g, '')

  const replacer = (match, leadingSpaces, jsonKey, jsonValue, endingChar) => {
    const openingSpanTagForJsonKeys = `<span class="json-key ${theme}">`;
    const openingSpanTagForJsonValues = `<span class="json-value ${theme}">`;
    const openingSpanTagForJsonStrings = `<span class="json-string ${theme}">`;
    const closingSpanTag = '</span>'
  
    let line = leadingSpaces || '';
    if (jsonKey) {
        line += openingSpanTagForJsonKeys + removeColon(jsonKey) + `${closingSpanTag}: `;
    }
    if (jsonValue) {
        line += (isJsonString(jsonValue) ? openingSpanTagForJsonStrings : openingSpanTagForJsonValues) + jsonValue + closingSpanTag;
    }
  
    return line + (endingChar || '');
  }

  return JSON.stringify(obj, null, 2)
      .replace(/&/g, '&amp;')
      .replace(/\\"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(jsonLine, replacer);
}
