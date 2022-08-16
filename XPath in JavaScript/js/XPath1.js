var xhttp = new XMLHttpRequest();
var variant;
var path;
var path1;
var path2;
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        showResult(xhttp.responseXML, "select title and price of 1st book");
        //showResult(xhttp.responseXML, "select all books with more than one author");
    }
};
xhttp.open("GET", "books.xml", true);
xhttp.send();

function showResult(xml, variant){
    //var variant = "";
    switch (variant){
        case "select title":
            path = "/bookstore/book/title";
            break;
        case "select title of first book":
            path = "/bookstore/book[1]/title";
            break;
        case "select all authors of the 3rd book":
            path = "/bookstore/book[3]/author";
            break;
        case "select all books with more than one author":
            path = "/bookstore/book[3]/title";
            break;
        case "select all the prices":
            path = "/bookstore/book/price[text()]";
            break;
        case "select price nodes with price>35":
            path = "/bookstore/book[price>35]/price";
            break;
        case "select title nodes with price<35":
            path = "/bookstore/book[price<35]/title";
            break;
        case "select title and price of 1st book":
            path = "/bookstore/book[1]/title";
            path1 = "/bookstore/book[1]/price";
            break;
        default:
            path = "/bookstore/book/title";
            variant = "default";

    }

    var txt = "You have asked for: " + variant  + "<br>" + "..and the result is: " + "<br>";
    //path = "/bookstore/book/price[text()]"
    if (xml.evaluate){
        var nodes = xml.evaluate(path, xml, null, XPathResult.ANY_TYPE, null);
        var nodes1= xml.evaluate(path1, xml, null, XPathResult.ANY_TYPE, null);
        var result1 = nodes1.iterateNext();
        var result = nodes.iterateNext();
        while (result) {
            if(variant ==="select title and price of 1st book"){
                txt += result.childNodes[0].nodeValue + "<br>" + result1.childNodes[0].nodeValue + "<br>";
                result = nodes.iterateNext();
                result1 = nodes1.iterateNext();
            }
            else {
                txt += result.childNodes[0].nodeValue + "<br>";
                result = nodes.iterateNext();
            }

        }
    }
    document.getElementById("demo").innerHTML = txt;
}