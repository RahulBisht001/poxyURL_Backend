// const Analytics = require("../models/Analytics");
const UA_Parser = require("ua-parser-js");

const getBrowserDetails = (userAgent) => {
    try {
        const parser = new UA_Parser(userAgent);
        const result = parser.getResult();

        return {
            browser: result.browser.name,
            os: result.os.name,
            deviceType: result.device.type,
        };
    } catch (error) {
        console.log("Error in getBrowserDetails", error);
    }
};

const getLocationDetails = async () => {
    try {
        const response = await fetch("https://ipapi.co/json");
        const {city, country_name} = await response.json();

        // console.log("Country", country_name);
        return {city, country_name};
    } catch (error) {
        console.log(error);
    }
};

module.exports = {getBrowserDetails, getLocationDetails};
