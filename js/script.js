$(function(){
    ////vars////
    var interval = 250;
	var vh = $(window).height()/100;
    var ease = 'easeOutQuad';
    var flipped = false;
    
    var $tap = $(".tap");
    var $next = $(".next");
    var $prev = $(".prev");
    var $note = $(".note");
    var $collapse = $(".collapse");
    var $grid = $(".grid");
    var $grids = $(".grids");
    var $cells = $(".grids .cell");
    
    var $front = $("#front");
    var $back = $("#back");
    var $info = $("#info");
    
    var page = $("body").data("num");
    var pages = 32;
    var infoYN = [false, true, true, false, false, true, false, true, false, true, true, false, true, false, false, false, false, false, true, false, false, false, true, true, false, true, true, false, false, false, true, false];
    var gridSwitch = false;
    
    ////init////
    $note.hide();
    showArr();
    $grids.hide();
    $(".cell:nth-of-type("+page+")").addClass("current");//differentiate cells at current page
    
    //Show Grids
    $grid.on('click',function(){
        if(!gridSwitch){
            $grids.css("opacity","0.1");
            $grids.show();
            $grids.animate({opacity:'1'},250);
            gridSwitch = true;
        }else{
            $grids.animate({opacity:'0'},250,function(){
                $grids.hide();
            });
            gridSwitch = false;
        }
    });
    
    //Link cells to card
    $cells.on('click',function(e){
        var target = e.target.innerText;
        if(target != page){
            window.location.href=target+".html";
        }
    });
    
    //Flip Cards
    $tap.on('click',function(){
        if(flipped){//back now
            flipped = false;
            
            $note.hide();
            $tap.removeClass('flip withNote')
            
            $back.addClass('easeOut');
            $front.addClass('easeIn');
            $back.removeClass('easeIn flipped');
            $front.delay(interval).removeClass('easeOut flipped');
        }else{//front now
            flipped = true;
            
            if(showInfo()){
                $note.show();
                $tap.addClass('withNote');
            }
            $tap.addClass('flip')
            
            $back.removeClass('easeOut');
            $front.removeClass('easeIn');
            $front.addClass('easeOut flipped');
            $back.delay(interval).addClass('easeIn flipped');
        }
    });
    
    //Show i or not
    function showInfo(){
        if(infoYN[page]){
            return true;
        }else{
            return false;
        }
    }
    
    //Show Arrows or not
    function showArr(){
        if(page == 0){
            $next.show();
            $prev.hide();
        }else if(page == pages){
            $prev.show();
            $next.hide();
        }else{
            $prev.show();
            $next.show();
        };
    }
    
    //Slide-in info
    $note.on('click',function(e){
        $tap.hide();
        $note.hide();
        $prev.hide();
        $next.hide();
        $info.animate({top:0},interval);
        $collapse.animate({top:93*vh},interval);
    });
    
    //Hide info
    $collapse.on('click',function(e){
        showArr();
        $info.animate({top:101*vh},interval);
        $collapse.animate({top:191*vh},interval,function(){
            $tap.show();
            if(showInfo()){
                $note.show();
                $tap.addClass('withNote');
            };
        });
    });
    
    $next.on('click',function(e){pageSwitch(1)});    
    $prev.on('click',function(e){pageSwitch(-1)});
    
    //Page Change
    function pageSwitch(go){
        if(go == 1){
            window.location.href=(page+1)+".html";
        }else{
            if(page == 1){
                window.location.href="index.html";
            }else{
                window.location.href=(page-1)+".html";
            }
        }
    }
});