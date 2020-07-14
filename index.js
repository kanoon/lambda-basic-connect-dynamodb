const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let statusCode = 0;
    let responseBody = '';
    try{
        //#region Insert data to DynamoDB
        let json = exports.getJsonData();
        if(json){
            await Promise.all(json.map(async item => {
                item.updated_date = new Date().toISOString();
                const putParam = {
                    TableName : "dev-test",
                    Item: item
                };
                
                await documentClient.put(putParam).promise();
            }));
        }
        //#endregion
        
        //#region Get data from DynamoDB
        
        const queryParam = {
        	TableName : "dev-test",
        	FilterExpression: "#country = :country",
		    ExpressionAttributeNames:{
		        "#country": "country"
		    },
		    ExpressionAttributeValues: {
		        ":country": "Japan"
		    }
        };
        
        var result = await documentClient.scan(queryParam).promise()
        console.log(JSON.stringify(result))
        responseBody = result;
        
        //#endregion
        statusCode = 200;
    }
    catch(error){
        console.log(error);
        statusCode = 403;
        responseBody = "Error";
    }
    
    
    const response = {
        statusCode: statusCode,
        body: responseBody
    };
    return response;
};

exports.getJsonData = () => {
	const json = [{id : "1", name: "Fuku", country: "Japan" },
	{id : "2", name: "Miki", country: "Japan"},
	{id : "3", name: "ShiShi", country: "Japan"},
	{id : "4", name: "MaDee", country: "Thailand"},
	{id : "5", name: "Max", country: "Can"}]
	return json;
};
