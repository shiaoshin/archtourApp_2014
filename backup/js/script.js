$(function(){
    ////vars////
    var flipped = false;
    var page = 0;
    var pages;
    var interval = 0.35;
	var vw = $(window).width();
	var vh = $(window).height()/100;
    var infoYN = [true];
    var disableSwipe = false;
    var ease = 'easeOutQuad';
    
    var $tap = $(".tap");
    var $next = $(".next");
    var $prev = $(".prev");
    var $note = $(".note");
    var $collapse = $(".collapse");
    var $openmap = $(".openmap");
    
    var $fronts;
    var $backs;
    var $infos;
    
    var $cards = $(".cards");
    
    ////init////
    $(document).on('pointermove', function(event) {event.preventDefault()}); //Init PxTouch
    $prev.hide();
    $note.hide();
    $openmap.hide();
    
    ////functions////
    //Get JSON data
    function getJSON(){
        var query = "SELECT * FROM " +
            '1tUdAnYlJyrYGR3-rDfcfqeVTy5y4EkBRQXXpiO78';
        var encodedQuery = encodeURIComponent(query);
        
        // Construct the URL
        var url = ['https://www.googleapis.com/fusiontables/v1/query'];
        url.push('?sql=' + encodedQuery);
        url.push('&key=AIzaSyCcxHuBSKMoJVhkoEfx5CEDhX8A9806TnA');
        url.push('&callback=?');
        
        // Send the JSONP request using jQuery
        $.ajax({
            url: url.join(''),
            dataType: 'jsonp',
            success: function (data) {
                
                //console.log(data.rows);
                var table = _.sortBy(data.rows, function(el,index){ return parseInt(el[0]); });
                var entries = table.length;
                pages = entries-1;
                console.log(table);
                
                // Determine Cards length
                $cards.css("width",(100*entries)+"vw");
                
                // Generate Landing Page
                var landBack = new Array();
                var landTitle = $("<header><b></b></header>").text(table[0][2]);
                var landContent = $("<p></p>").text(table[0][10]);
                var landContact = $("<h4 style='text-align:center;margin-top:10px;'><strong>緊急聯絡人："+table[0][22]+"</strong><br>"+table[0][24]+"</h4>");
                var landTable = $("<div class='table'></div");
                var landTableTime = table[0][25].split(",");
                var landTableSche = table[0][27].split(",");
                $.each(landTableTime, function(index,el){
                    landTable.append("<p>"+el+"<span>"+landTableSche[index]+"</span></p>")
                });
                landBack.push(landTitle,landContent,landContact,landTable);
                $("#landing .back").append(landBack);
                
                // Generate Credit Page
                var creditTitle = $("<header><b></b></header>").text(table[pages][2]);
                var creditTable = $("<div class='table'></div");
                var creditTableList = table[pages][25].split(",");
                var creditTableContent = table[pages][27].split(",");
                $.each(creditTableList, function(index,el){
                    creditTable.append("<p>"+el+"<span>"+creditTableContent[index]+"</span></p>");  
                });
                $("#credit .front").append(creditTitle,creditTable);
                
                // Generate Card Contents
                for(var i = entries-2 ; i > 0 ; i--){
                    //build front
                    var newFront = $("<div></div>");
                    newFront.addClass("front");
                    newFront.css("background-image","url('../img/"+table[i][0]+"_m.jpg')");
                    newFront.append($("<div></div>").addClass("navItem type").text(table[i][0]));
                    
                    //build back & Info
                    var newBack = $("<div></div>");
                    var newInfo = $("<div></div>");
                    var backEl = new Array();
                    var infoEl = new Array();
                    $.each(table[i],function(index,el){
                        switch (index){
                            case 0://Type
                                var newType = $("<div></div>").addClass("navItem type").text(el);
                                backEl.push(newType);
                                break;
                            case 1://Header
                                var newHeader = $("<header><b></b></header>").text(el);
                                backEl.push(newHeader);
                                break;
                            case 2://Name
                                if(el){
                                    var newName = $("<li></li>").text(el);
                                    backEl.push(newName);
                                };
                                break;
                            case 3:
                                if(el){//Style
                                    var newStyle = $("<li></li>").text("風格: "+el);
                                    backEl.push(newStyle);
                                };                                
                                break;
                            case 5:
                                if(el){//Floor
                                    var newFloor = $("<li></li>").text("樓層數: "+el);
                                    backEl.push(newFloor);
                                };
                                break;
                            case 6:
                                if(el){//Height
                                    var newHeight = $("<li></li>").text("高度: "+table[i][6]+" ft / "+table[i][7]+"m");
                                    backEl.push(newHeight);
                                };
                                break;
                            case 8:
                                if(el){//Year
                                    var newYear = $("<li></li>").text("建造年代: "+el);
                                    backEl.push(newYear);
                                };
                                break;
                            case 9:
                                if(el){//Arcitect
                                    var newArcitect = $("<li></li>").text("建築師: "+el);
                                    backEl.push(newArcitect);
                                };
                                break;
                            case 10://Content
                                var newContent = $("<p></p>").text(el);
                                backEl.push(newContent);
                                break;
                            case 13://Reference
                                var newRef = $("<p></p>").text(el);
                                break;
                            case 15:
                                var newCC = $("<div class='cc'></div>").html(el);
                                backEl.push(newCC);
                                break;
                            case 16:
                                if(el){
                                    infoYN[i] = true;
                                    var newNoteTitle = $("<header><b></b></header>").text(el);
                                    infoEl.push(newNoteTitle);
                                }else{
                                    infoYN[i] = false;
                                }
                                break;
                            case 18:
                                if(el){
                                    var newNoteImg = $("<img class='img-responsive'>").attr("src","../img/"+table[i][0]+"_note_m.jpg")
                                    infoEl.push(newNoteImg);
                                }
                                break;
                            case 19:
                                var newNoteContent = $("<p></p>").text(el);
                                infoEl.push(newNoteContent);
                                break;
                            case 21:
                                if(el){
                                    var newNoteImgCC = $("<div class='cc'></div>").html(el);
                                    infoEl.push(newNoteImgCC);
                                }
                                break;
                            default:
                                break;
                        }
                    });
                    newBack.addClass("back");
                    newBack.append(backEl);
                    newInfo.addClass("info");
                    newInfo.append(infoEl);
                    
                    //build card
                    var newCard = $("<div></div>").addClass("card");
                    if(table[i][16]){
                        newCard.append(newFront,newBack,newInfo);
                    }else{
                        newCard.append(newFront,newBack);
                    }
                    
                    //append card
                    $("#landing").after(newCard);
                };
                
                // Update Cards
                $fronts = $(".front");
                $backs = $(".back");
                $infos = $(".info");
                
                infoYN.push(true);
            }
        })
    }
    getJSON();
    
    //Swipe Cards
    $prev.on('tap',function(e){
        e.preventDefault();
        swipeCard(-1);
    });
    $next.on('tap',function(e){
        e.preventDefault();
        swipeCard(1);
    });
    $("body").on('swipeend',function(e){
        e.preventDefault();
        var angleDiff = 75; 
        if(!disableSwipe){
            if(e.angle < (angleDiff/2) || e.angle > (360-angleDiff/2)){
                swipeCard(-1);//alert("prev");
            }else if(e.angle > (180-angleDiff/2) && e.angle < (180+angleDiff/2) ){
                swipeCard(1);//alert("next");
            };
        }
    });
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