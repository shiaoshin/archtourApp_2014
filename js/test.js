$(function(){
    ////vars////
    var flipped = false;
    var page = 0;
    var pages;
    var interval = 0.35;
	var vw = $(window).width();
	var vh = $(window).height()/100;
    var infoYN = [true];
    //var disableSwipe = false;
    var ease = 'easeOutQuad';
    
    var $tap = $(".tap");
    var $next = $(".next");
    var $prev = $(".prev");
    var $note = $(".note");
    var $collapse = $(".collapse");
    var $openmap = $(".openmap");
    
    var $fronts = $(".front");
    var $backs = $(".back");
    var $infos = $(".info");
    
    var $cards = $(".cards");    
    
    //Init
    $prev.hide();
    $note.hide();
    $openmap.hide();
    ////vars////
    var flipped = false;
    var page = 0;
    var pages = 31;
    var interval = 0.35;
	var vw = $(window).width();
	var vh = $(window).height()/100;
    var infoYN = [true];
    //var disableSwipe = false;
    var ease = 'easeOutQuad';
    
    var $tap = $(".tap");
    var $next = $(".next");
    var $prev = $(".prev");
    var $note = $(".note");
    var $collapse = $(".collapse");
    var $openmap = $(".openmap");
    
    var $fronts = $(".front");
    var $backs = $(".back");
    var $infos = $(".info");
    
    var $cards = $(".cards");    
    
    //Init
    $prev.hide();
    $note.hide();
    $openmap.hide();
    
    //Swipe Cards
    $prev.on('tap',function(e){
        e.preventDefault();
        swipeCard(-1);
    });
    $next.on('tap',function(e){
        e.preventDefault();
        swipeCard(1);
    });
    /*$("body").on('swipeend',function(e){
        e.preventDefault();
        var angleDiff = 75; 
        if(!disableSwipe){
            if(e.angle < (angleDiff/2) || e.angle > (360-angleDiff/2)){
                swipeCard(-1);//alert("prev");
            }else if(e.angle > (180-angleDiff/2) && e.angle < (180+angleDiff/2) ){
                swipeCard(1);//alert("next");
            };
        }
    });*/
    function swipeCard(to){
        $next.show();
        $prev.show();
        if (to == 1){
            if(page < pages){//marching to the end of cards
                if(page == (pages-1)){
                    $next.hide();
                };
                page++;
                travel = vw * page;
                TweenLite.to($cards, interval, {
                    delay: 0.05,
                    x: -travel,
                    ease: ease
                });
            }else{
                $next.hide();
                page = pages;
            }
        }else if(to == -1){
            if(page >= 1){//reaching the begining of cards
                if(page == 1){
                    $prev.hide();
                }
                page--;
                travel = vw * page;
                TweenLite.to($cards, interval, {
                    delay: 0.05,
                    x: -travel,
                    ease: ease
                });
            }else{
                $prev.hide();
                page = 0;
            }
        };
        if(flipped && showInfo()){
            $note.show();
            $tap.addClass('withNote');
        }else{
            $note.hide();
            $tap.removeClass('withNote')
        }
    };
    
    //Flip Cards
    $tap.on('tap',function(e){
        e.preventDefault();
        if(flipped){//back now
            flipped = false;
            
            $note.hide();
            $tap.removeClass('flip withNote')
            
            $backs.addClass('easeOut');
            $fronts.addClass('easeIn');
            $backs.removeClass('easeIn flipped');
            $fronts.delay(500).removeClass('easeOut flipped');
        }else{//front now
            flipped = true;
            
            if(showInfo()){
                $note.show();
                $tap.addClass('withNote');
            }
            $tap.addClass('flip')
            
            $backs.removeClass('easeOut');
            $fronts.removeClass('easeIn');
            $fronts.addClass('easeOut flipped');
            $backs.delay(500).addClass('easeIn flipped');
        }
    });
    
    //Show info or not
    function showInfo(){
        if(infoYN[page]){
            return true;
        }else{
            return false;
        }
    }
    
    //Show info
    $note.on('tap',function(e){
        e.preventDefault();
        disableSwipe = true;
        $tap.hide();
        $note.hide();
        $prev.hide();
        $next.hide(); 
        TweenLite.to($(".info"), interval, {
            delay: 0.05,
            css: {top:"2vh"},
            ease: ease
        });
        TweenLite.to($collapse, interval, {
            delay: 0.05,
            css: {top:"91vh"},
            ease: ease
        });
    });
    
    //Hide info
    $collapse.on('tap',function(e){
        e.preventDefault();
        disableSwipe = false;
        $prev.css("opacity","100");
        $next.css("opacity","100");
        if(page == 0){
            $next.show();
        }else if(page == pages){
            $prev.show();
        }else{
            $prev.show();
            $next.show();
        }
        TweenLite.to($(".info"), interval, {
            delay: 0.05,
            css: {top:"101vh"},
            ease: ease
        });
        TweenLite.to($collapse, interval, {
            delay: 0.05,
            css: {top:"191vh"},
            ease: ease,
            onComplete: function(e){
                $tap.show();
                if(showInfo()){
                    $note.show();
                    $tap.addClass('withNote');
                };
            }
        });
    });
});