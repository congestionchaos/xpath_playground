var xhttp = new XMLHttpRequest();
var variant;
var path;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        showResult(xhttp.responseXML, "How many actors do we have?");
        showAttributes(xhttp.responseXML);
        showTasks(xhttp.responseXML);
    }
};
// furniture XML example is used since it has two different namespaces
xhttp.open("GET", "actors_trimmed.xml", true);
xhttp.send();

function showResult(xml, variant) {
    //var variant = "";
    switch (variant) {
        case "Who is the last actor in the first task?":
            // the table uses the "f" namespace
            path = "string(//*[name()='cp:actor'][last()]/@name)";  // the "Select any"-Operator: '//' will always select the 1st task
                                                                    // to explicitly reference the 1st task it is necessary to specify the selection
                                                                    // using "and" + "position()=desiredtaskposition"
            // path ="string(//*[local-name()='task' and position()=1]/*[name()='cp:actor'][last()]/@name)" ;
            // should be the same as: path = "string(//*[name()='cp:actor'][last()]/@name)";

            //xmlnamespace = 'https://www.w3schools.com/furniture';
            break;
        case "Who is the 11th actor in the 2nd task?":
            path = "string(//*[local-name()='task' and position()=2]/*[name()='cp:actor'][position()=11]/@name)";
            break;
        case "What is the name of the 2nd task?":
            path = "string(//*[local-name()='task' and position()=2]/@name)";
            break;
        case "How many actors do we have?":
            path = "count(//*[local-name()='task' and position()=2]/*[local-name()='actor'])";
            break;
        default:
            variant = "default";
            path = "//*";
    }


    var txt = "You have asked for: " + variant  + "<br>" + "..and the result is: " + "<br>";

    if (xml.evaluate) {
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        nodesresult = console.log(nodes);
        console.log(nodes);
        resulttype = nodes.resultType;
        switch (resulttype) {
            case 1:
                // resultType 1: result is of number type;
                txt += nodes.numberValue;
                break;
            case 2:
                // resultType 2: result is of string type;
                txt += nodes.stringValue;
                break;
            case 3:
                // resultType 3: result is of boolean type;
                txt += nodes.booleanValue;
                break;
            case 4:
                // resultType 4: result is an (unordered) XPathResultIterator --> a Set of Nodes
                var result = nodes.iterateNext();
                while (result) {
                    txt += result.childNodes[0].nodeValue + "<br>";
                    result = nodes.iterateNext();
                }
                break;
            default:
            // default behavior
        }
    }
    document.getElementById("demo_2").innerHTML = txt;
}

function showAttributes(xml){
    var attrtxt ="You've asked for all actors and here they are.. <br>" ;
    let countpath = "count(//*[local-name()='task' and position()=2]/*[local-name()='actor'])";
    let numberofattributes = xml.evaluate(countpath,xml, null, XPathResult.STRING_TYPE, null);
    console.log(numberofattributes);
    let nrofattr = parseInt(numberofattributes.stringValue);
    console.log(nrofattr);
    let testnumber = 3;
    let testpath = "string(//*[local-name()='task' and position()=2]/*[local-name()='actor' and position()=" +testnumber.toString()+"]/@name)";
    console.log("the testpath is working.. " + testpath);
    let testpathresult = xml.evaluate(testpath, xml, null, XPathResult.STRING_TYPE, null);
    console.log(testpathresult.stringValue);
    for(let i = 1; i <nrofattr+1; i++ ){
        console.log("this is loop nr.: " + i +"[starting with 1]");
        stringattrpath = "string(//*[local-name()='task' and position()=2]/*[local-name()='actor' and position()=" +i.toString()+"]/@name)";
        console.log(stringattrpath);
        stringattrpathresult = xml.evaluate(stringattrpath, xml, null, XPathResult.STRING_TYPE, null);
        console.log(stringattrpathresult);
        attrtxt += stringattrpathresult.stringValue +"<br>";
    }



    document.getElementById("actor_demo").innerHTML = attrtxt;
}

function showTasks(xml){
    var tasktxt = "You've asked for all tasks and here they are.. <br>";
    let countpath = "count(//*[local-name()='task'])";
    let numberoftasks = xml.evaluate(countpath, xml, null, XPathResult.STRING_TYPE, null);
    console.log(numberoftasks);
    let nroftasks = parseInt(numberoftasks.stringValue);
    console.log(nroftasks);
    for(let i =1; i<nroftasks+1; i++){
        stringtaskpath = "string(//*[local-name()='task' and position() = " +i.toString() + "]/@name)";
        console.log(stringattrpath);
        stringtaskpathresult = xml.evaluate(stringtaskpath, xml, null, XPathResult.STRING_TYPE, null);
        console.log(stringtaskpathresult);
        tasktxt += stringtaskpathresult.stringValue + "<br>";
    }

    document.getElementById("task_demo").innerHTML = tasktxt;
}
