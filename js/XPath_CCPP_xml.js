var xhttp = new XMLHttpRequest();
var variant;
var path;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getStages(xhttp.responseXML);
        getActorsofStages(xhttp.responseXML);
    }
};
xhttp.open("GET", "Colorectal Cancer Patient Pathway.xml", true);
xhttp.send();

function getStages(xml) {
    // in order to retrieve specific nodes of a XPathResult node set the individual nodes can be accessed with "snapshitItem(itemNumber)"
    let stagevaluepath = "//*[local-name()='categoryValue']/@value";
    let allstages = xml.evaluate(stagevaluepath, xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    // XPathResult Type cannot be "ANY_TYPE" because then the Result would be of "UNORDERED_ITERATOR_TYPE"
    // the for-loop would not work on an Iterator-Type Result
    console.log(allstages);
    let txt = "The Stages in the XML are: <br>";
    for (let i = 0; i < allstages.snapshotLength; i++) {
        console.log("testing the loop.." + "this is loop nr." + i);
        console.log(allstages.snapshotItem(i).textContent);
        txt += allstages.snapshotItem(i).textContent + "<br>";
    }
    console.log(txt);
    document.getElementById("Stages").innerHTML = txt;
}

function getActorsofStages(xml){
    // copy-pasta from getTaskIDwithSnapshot function:
    let stagevaluepath = "//*[local-name()='categoryValue']/@value";
    let allstages = xml.evaluate(stagevaluepath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    let stageidpath = "//*[local-name()='categoryValue']/@id";
    let allstageids = xml.evaluate(stageidpath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    let actornamepath = "//*[local-name()='categoryValue']/*[local-name()='extensionElements']/*/@name";
    let txt ="The Tasks in the XML are: <br>";
    console.log(allstages.snapshotLength);
    for(let i = 0; i <allstages.snapshotLength; i++){
        console.log("testing the outer loop.." + "this is loop nr." + i);
        console.log(allstages.snapshotItem(i).textContent);
        txt += allstages.snapshotItem(i).textContent + "<br>";

        // using the StageID, a new XPath expression can be build:
        let actorsinstages = "//*[local-name()='categoryValue' and @id='" +allstageids.snapshotItem(i).textContent + "']/*[local-name()='extensionElements']/*/@name";
        console.log(actorsinstages);
        let allactors = xml.evaluate(actorsinstages, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        console.log(allactors.snapshotLength);
        if(allactors.snapshotLength > 0)
            {
        txt += "The Actors in this task are: <br>";
        // inner loop should retrieve all actors of a given task
        for (let i = 0; i <allactors.snapshotLength; i++){
            console.log("testing the inner loop.." + "this is loop nr." + i);
            console.log(allactors.snapshotItem(i).textContent);
            txt += allactors.snapshotItem(i).textContent + ", ";
        }

        }

        txt += "<br>";
    }
    console.log(txt);
    document.getElementById("Stages_and_Actors_involved").innerHTML =txt;
}

function getStagesofActors(xml){


    document.getElementById("Actors_and_Stages_involved").innerHTML =txt;
}



