$(function () {
    console.log("jquery is running");
    $("form#editItem").on("submit", function(e) {
       e.preventDefault();
        //console.log("button clicked!");
        //button loading
        const button = $(this).find("#submit-button");
        button.html("<span class='spinner-border spinner-border-sm'></span>");
        console.log("button html", button.html());
        //grab text area
        const text = $(this).find("#editName").val();
        const path = $(this).data("update-path");
        //console.log("path", path);
        $.ajax({
            type: "POST",
            url: path,
            data: {editName: text},
            success: function(response) {
                //button flash "Saved!"
                button.html("Saved!");
                setTimeout(() => {
                    button.html("Save");
                }, 2000);
                console.log(response);
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    });

    $("img#delete").on("click", function() {
        console.log("delete triggered!");
        const listID = $(this).data("list-to-delete");
        console.log("passed in list ID:", listID);
        $.ajax({
            type: "DELETE",
            url: "/lists/" + listID,
            success: function(response) {
                $("div#list-" + listID).slideUp();
                //$("div#list-" + listID).remove();
                console.log("removed from UI!");
            },
            error: function(xhr, status, error) {
                console.log(error);
            }
        });
    });
});



// module.exports = {validate};