(function($){
/* start */

/* modal options */
$('.modal-trigger').leanModal({
    dismissible: true, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    in_duration: 200, // Transition in duration
    out_duration: 100, // Transition out duration
    ready: function() { // Callback for Modal open
        console.log(this);

    }, 
    complete: function() { // Callback for Modal close
        console.log('Closed'); 
    } 
});

/*modal content submit */
$('#modal-bug-submit').click(function(e){
    if( ! textLenValidate('modal-bug-text', 200) ) {
        return;
    }

    $.ajax({
        url: "/hongbao/report",
        method: "POST",
        data: { 
            data: 'test'
        },
        success: function(){
            $('#modal-bug').closeModal();
        }
    });
});

/* ripple effect */
$(".ripple-btn").click(addRippleEffect);
function addRippleEffect(e) {
    var target = e.target;
    if (target.tagName.toLowerCase() !== 'div') {
        return ;
    }
    var rect = target.getBoundingClientRect();
    var ripple = target.querySelector('.ripple');
    if (!ripple) {
        ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px';
        target.appendChild(ripple);
    }
    ripple.classList.remove('show');
    var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop;
    var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft;
    ripple.style.top = top + 'px';
    ripple.style.left = left + 'px';
    ripple.classList.add('show');
    return false;
}


/* Common functions */

/* validate text length */
function textLenValidate(tarId, len) {
    var tarStr = $('#'+tarId).val();
    if (tarStr.length <= len) {
        return true;
    }
    else {
        return false;
    }
}

/* input len count */
function inputLenCount(ipnutId, outputId, maxLen) {
    var outObj = $('#'+outputId);
    var inObj = $('#'+ipnutId);

    inObj.keyup(function(){
        var inLen = inObj.val().length;
        
        if (inLen > maxLen) {
            outObj.css( "color", "red" );
        }
        outObj.text(inLen + "/" + maxLen);

    });
}

/** end **/
})(jQuery);

