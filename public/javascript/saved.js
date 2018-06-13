function displaySaved() {
    $.getJSON("/saved/all", function (data) {
        $("#nyt-0").empty();
        $("#nyt-1").empty();
        $("#nyt-2").empty();
        $("#total-number").text(data.length);
        for (var i = 0; i < data.length; i++) {
            var mainDiv = $("<div>");
            mainDiv.addClass("card grey lighten-2");
            mainDiv.attr("id", "main-" + data[i]._id);
            var cardContentDiv = $("<div>");
            cardContentDiv.addClass("card-content black-text");
            var spanTitle = $("<span>");
            spanTitle.addClass("card-title");
            spanTitle.attr("data-id", data[i]._id);
            spanTitle.attr("id", "title-" + data[i]._id);
            spanTitle.text(data[i].title);
            var p = $("<p>");
            p.text(data[i].summary);
            p.attr("id", "summary-" + data[i]._id);
            cardContentDiv.append(spanTitle);
            cardContentDiv.append(p);
            var cardActionDiv = $("<div>");
            cardActionDiv.addClass("card-action");
            var a = $("<a>");
            a.attr("href", data[i].link);
            a.attr("id", "link-" + data[i]._id);
            a.text("Go to the Headline");
            cardActionDiv.append(a);
            var button = $("<a>");
            button.addClass("waves-effect waves-light white btn create-note modal-trigger");
            button.attr("data-id", data[i]._id);
            button.attr("data-target", "notes");
            button.text("Create Notes");
            var deleteHeadline = $("<a>");
            deleteHeadline.addClass("waves-effect waves-light white btn delete-button");
            deleteHeadline.attr("id", data[i]._id);
            deleteHeadline.text("Delete");
            var byline = $("<p>");
            byline.text(data[i].byline);
            cardActionDiv.append(byline);
            cardActionDiv.append(button);
            cardActionDiv.append(deleteHeadline);
            mainDiv.append(cardContentDiv);
            mainDiv.append(cardActionDiv);

            $("#nyt-" + String(i % 3)).append(mainDiv);
        }
    });
}

function deletenote(thisId) {
    var data = {
        "_id": thisId
    };
    console.log(data);
    $.ajax({
        type: "DELETE",
        url: "/deletenote",
        data: data,
        success: function (data, textStatus) {
            $("#" + thisId).remove();
        }
    })
}

$(document).ready(function () {
    $('.slider').slider();
    $(".button-collapse").sideNav();
    $('.modal').modal();

    $(document).on('click', '.save-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var byline = $("#byline-" + thisId).text();
        var data = {
            "id": thisId,
            "summary": summary,
            "title": title,
            "link": link,
            "byline": byline
        };
        $.ajax({
            type: "POST",
            url: "/save",
            data: data,
            dataType: "json",
            success: function (data, textStatus) {
                console.log(data);
            }
        });
    });
    $(document).on('click', '.delete-button', function () {
        var thisId = $(this).attr("id");
        var summary = $("#summary-" + thisId).text();
        var title = $("#title-" + thisId).text();
        var link = $("#link-" + thisId).attr('href');
        var byline = $("#byline-" + thisId).text();
        var data = {
            "_id": thisId
        };
        $.ajax({
            type: "DELETE",
            url: "/delete",
            data: data,
            success: function (data, textStatus) {
                $("#main-" + thisId).remove();
            }
        })
    });

    $(document).on("click", ".create-note", function (data) {
        $("#savenote").attr("data-id", $(this).attr("data-id"));
        let aid = $(this).attr("data-id");
        let title = "Notes for the Headline: " + aid;
        $("#display-title").empty();
        $("#display-title").text(title);
        $("#textarea1").val("");
        $.getJSON("/notes/" + aid, function (data) {
            if(data.length) {
                console.log(data);
                let notetext = "Notes: " + data[0].body;
                $("#display-note").empty();
                let noteList = $("<ul>");
                noteList.addClass("collection with-header");
                let hli = $("<li>");
                hli.addClass("collection-header")
                hli.text("Notes");
                noteList.append(hli);
            
                for (let i = 0; i < data.length; i++) {
                    let ili = $("<li>");
                    ili.attr("id", data[i]._id);
                    ili.addClass("collection-item");

                    let idiv = $("<div>");
                    idiv.text(data[i].body);

                    let adelete = $("<a>");
                    adelete.addClass("secondary-content");
                    adelete.attr("note-id", data[i]._id);
                    adelete.attr("href", "#");
                    adelete.attr("onclick", 'deletenote("' + data[i]._id + '")');
                    let xdelete = $("<i>");
                    xdelete.addClass("material-icons");
                    xdelete.attr("note-id", data[i]._id);
                    xdelete.html("delete");
                    adelete.append(xdelete);
                    idiv.append(adelete);
                    ili.append(idiv);
                    noteList.append(ili);
                }
                $("#display-note").append(noteList);
            }
        });
    });

    $(document).on("click", "#savenote", function () {
        var thisId = $(this).attr("data-id");
        var text = $("#textarea1").val();
        console.log(thisId);
        $.ajax({
            type: "POST",
            url: "/notes",
            data: {
                "Headline_id": thisId,
                "body": text
            },
            success: function (data, textStatus, jqXHR) {
                console.log(data);
                $("#textarea1").val("");
            }
        });
    });
    $(document).on("click", "#deletenote", function () {
        $.ajax({
            type: "DELETE",
            url: "/deletenote",
            data: data,
            success: function (data, textStatus) {
                $("#display-note").remove();
            }
        });
    });
});