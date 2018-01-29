function showModal(message){

    $('#mod-txt').html(message)
    $('#scrape-result').modal('show')
}

function saveBtnHandler(btn){
    let link = btn.data('link');
    let saved = btn.data('saved');

    $.post({
        url: '/save',
        data: {
            link: link,
            saved: !saved
        }
    }).done(function(response){

        btn.data('saved', !saved);
        btn.attr('data-saved', !saved);

        if(saved){
            console.log("change html to save")
            btn.html('save');
            btn.addClass('unsaved')
        } else {
            console.log("change html to unsave");
            btn.html('unsave');
            btn.removeClass('unsaved');
        };
    });
};

$(document).ready(function(){

    $('.save-button').on('click', function(ev){
        saveBtnHandler($(this));
    });

    $('#scrape').on('click', function(event){
        event.preventDefault();

        $.post({
            url: '/articles'
        }).done(function(response){

            //display results modal
            showModal(response.newArticles.toString() + ' Article(s) added');

            //only reload articles if a new one was found
            if(response.newArticles > 0){

                $('#article-container').empty();

                var arts = response.articleArray
                for(i in arts){
                    //set variables based on the saved status of the given article
                    let btnTxt = arts[i].saved ? 'unsave' : 'save';
                    let btnClass = arts[i].saved ? "btn btn-warning save-button" : "btn btn-warning unsaved save-button";

                    //build html for each article with appropriate data
                    let article = $('<div class="article row">' +
                                        '<div class="col col-sm-10">' +
                                            '<h3>' + arts[i].title + '</h3>' +
                                            '<h5>' + arts[i].exerpt + '</h5>' +
                                            '<a href="' + arts[i].link + '">View Article</a>' +
                                        '</div>' +
                                        '<div class="col col-sm-2 save-btn-div" align="center">' +
                                            '<button data-link="' + arts[i].link + '" data-saved="' + arts[i].saved + '" class="' + btnClass + '">' + btnTxt +'</button>' +
                                        '</div>' +
                                    '</div>')

                    //append article to page
                    $('#article-container').append(article);
                };
                
                //re-bind save buttons since we just deleted the original ones
                $('.save-button').on('click', function(ev){
                    saveBtnHandler($(this));
                });
                
                //reset the previous-page and next-page button values and the page value. 
                //this is a workaround for the fact that a post requst can't follow a res.redirect :(
                $('#prevPage').attr('href', '/articles/0');
                $('#page').html('1');
                $('#nextPage').attr('href', '/articles/2');
            }
        });
    });
});



