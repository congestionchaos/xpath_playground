var xhttp = new XMLHttpRequest();
var variant;
var path;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        getStages(xhttp.responseXML);
        HelperAllStages();
        getActorsofStages(xhttp.responseXML);
        getStagesofActors(xhttp.responseXML);
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

function HelperAllStages(){
    let xml = xhttp.responseXML;
    let stagevaluepath = "//*[local-name()='categoryValue']/@value";
    let allstages = xml.evaluate(stagevaluepath, xml, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let unsortedSetofStages = new Set();
    for (let i = 0; i < allstages.snapshotLength; i++) {
        unsortedSetofStages.add(allstages.snapshotItem(i).textContent);
    }
    console.log(unsortedSetofStages);
    const ArrayOfStages = Array.from(unsortedSetofStages);
    console.log(ArrayOfStages);
    return ArrayOfStages;
}



function getActorsofStages(xml){
    // copy-pasta from getTaskIDwithSnapshot function:
    let stagevaluepath = "//*[local-name()='categoryValue']/@value";
    let allstages = xml.evaluate(stagevaluepath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    let stageidpath = "//*[local-name()='categoryValue']/@id";
    let allstageids = xml.evaluate(stageidpath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    //let actornamepath = "//*[local-name()='categoryValue']/*[local-name()='extensionElements']/*/@name";


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

    let txt = "Actors and involved Stages: " + "<br>";

     let SetOfActors = new Set();

    //stageIDs + names will be stored in another Map
    let MapOfStages = new Map();
    let stageidpath = "//*[local-name()='categoryValue']/@id";
    let stagenamepath = "//*[local-name()='categoryValue']/@value";

    // store all id's and names in snapshots and add them to the map
    let allstageids = xml.evaluate(stageidpath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    let allstagenames = xml.evaluate(stagenamepath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0; i < allstageids.snapshotLength; i++){
        MapOfStages.set(allstageids.snapshotItem(i).textContent, allstagenames.snapshotItem(i).textContent);
        let actorsinstages = "//*[local-name()='categoryValue' and @id='" +allstageids.snapshotItem(i).textContent + "']/*[local-name()='extensionElements']/*/@name";
        console.log(actorsinstages);
        let allactors = xml.evaluate(actorsinstages, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < allactors.snapshotLength; i++){
            SetOfActors.add(allactors.snapshotItem(i).textContent);
        }

    }
    console.log(SetOfActors);
    console.log(SetOfActors.size);

    // create an iterator to travers through the set of Actors
    const ActorSetIterator = SetOfActors.values();

    // create an iterator to travers through the Map-keys of the MapOfStages
    const StageMapIterator = MapOfStages.keys();

    // for each Actor in the Set: check in which stages they participate

    let stageamountpath = "count(//*[local-name()='categoryValue'])";
    let amountofstages = xml.evaluate(stageamountpath, xml, null, XPathResult.NUMBER_TYPE, null);
    console.log(amountofstages);

    for (let i = 0; i < SetOfActors.size; i++){
        let CurrentActor = ActorSetIterator.next().value;
        txt+= "Actor: " + CurrentActor + " is required in Stages: ";
        console.log(amountofstages.numberValue);

        console.log(StageMapIterator.next().value);


        for (let j = 0; j < amountofstages.numberValue; j++){

            // get the stageIDs in a Snapshot
            currentstageIDpath = "//*[local-name()='categoryValue']/@id";
            let currentstageID = xml.evaluate(currentstageIDpath, xml, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

            let actorcheckpath = "boolean(//*[local-name()='categoryValue' and @id='"+ currentstageID.snapshotItem(j).textContent + "']/*[local-name()='extensionElements']/*/@name='" +CurrentActor  +"')";
            console.log(actorcheckpath);
            let isActorinStage = xml.evaluate(actorcheckpath, xml, null, XPathResult.BOOLEAN_TYPE, null);
            console.log(isActorinStage);
            if (isActorinStage.booleanValue === true){
                // add this Stage to the txt
                // get the name of the stage with a known stageID
                let stagename = MapOfStages.get(currentstageID.snapshotItem(j).textContent);
                txt += stagename +  ", ";
            }
        }
        txt += "<br>";
    }

    document.getElementById("Actors_and_Stages_involved").innerHTML =txt;
}



