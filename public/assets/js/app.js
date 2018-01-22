$(document).ready(function(){
    
    $('#scrape').on('click', function(ev){
        ev.preventDefault();

        $.ajax({
            method: "POST",
            url: '/'
        }).done(function(response){
            console.log(response);
        })
    })

})