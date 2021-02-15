const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
const {
	getIntrospectionQuery,
	printSchema,
	buildClientSchema,
} = require("graphql");

/**
 * runs an introspection query on an endpoint and retrieves its result
 * thanks to this gist:
 * https://gist.github.com/craigbeck/b90915d49fda19d5b2b17ead14dcd6da
 */

async function main() {
	const endpoint = process.env.ENDPOINT;
	if(!endpoint || endpoint.indexOf("your-wordpress-blog.orlocalhost") !== -1){
		console.log("please set ENDPOINT environment variable to your graphql endpoint, aborting")
		return;
	}
	const introspectionQuery = getIntrospectionQuery();
	const response = await fetch(endpoint, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ query: introspectionQuery }),
	});
	const { data } = await response.json();
	const schema = buildClientSchema(data);
	const outputFile = path.join(__dirname, "./../schema-in/wpgraphql-schema.gql");
	await fs.promises.writeFile(outputFile, printSchema(schema));
}

main();
