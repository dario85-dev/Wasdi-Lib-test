function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

// docReady(function () {
//     // DOM is loaded and ready for manipulation here
//     // load the configuration from config.json file
//     wasdi.loadConfig();
//     // login to Wasdi
//     wasdi.login();
//
// });

// load the configuration from config.json file
wasdi.loadConfig();
// login to Wasdi
wasdi.login();


// Local function to create a workspace
createWorkspace = () => {
    let wsName = document.getElementById("wsname").value;
    // this is the actual call to WASDI services
    let response = wasdi.createWorkspace(wsName);
    console.log(response);
}


getDeployed = function () {
    //Obtain a list of availble processors from WASDI
    var deployed = wasdi.getDeployed();
    let selectionList = document.getElementById("ProcessorSelect");

    deployed.forEach(element => {
        let option = document.createElement("option");
        option.text = element.processorName;
        selectionList.add(option);
    });

}

loadProcessorParameters = function () {
    let list = document.getElementById("ProcessorSelect");
    let selectedProcessor = list.options[list.selectedIndex].text;

    wasdi.getDeployed().forEach(element => {
        if (element.processorName == selectedProcessor) {
            // Here is required the devode URI call
            document.getElementById("parameters").value = decodeURI(element.paramsSample);
        }
    });
}

let launchedProcessorID = [];
let intervalHandler;

executeProcessor = function () {
    let list = document.getElementById("ProcessorSelect");
    let selectedProcessor = list.options[list.selectedIndex].text;
    let parameters = document.getElementById("parameters").value;
    let response = wasdi.executeProcessor(selectedProcessor, encodeURI(parameters));
    console.log(response.processingIdentifier);
    launchedProcessorID.push(response.processingIdentifier);
    intervalHandler = setInterval(callback, 2000);
}



callback = () => {
    if(launchedProcessorID.length > 0){
        getStatus();
    }
}

stopQueryStatus = () => {
    clearInterval(intervalHandler);
}

// Util function to render a formatteed string from the process status reponse
getProcessorString = function (status) {
    let response = "";
    response = response.concat("Processor name " + status.productName + " | " + "status " + status.status + " | % " + status.progressPerc + " | Payload " + status.payload);
    return response;
}

getStatus = function () {
    document.getElementById("processorStatus").innerHTML = "";
    launchedProcessorID.forEach(element => {
        let status = wasdi.getProcessStatus(element);
        document.getElementById("processorStatus").innerHTML = document.getElementById("processorStatus").innerHTML.concat(
            getProcessorString(status) + "<br>"
        );
    });
}

