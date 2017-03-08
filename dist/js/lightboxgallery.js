/*!
* Lightbox Gallery v1.0 (https://github.com/kawshar/lightboxgallery)
* Copyright 2017 Kawshar Ahmed
* Licensed GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
*/

;(function($){

  $.fn.lightboxgallery = function(options) {

    var settings = {
      'showCounter': true,
      'showTitle': true,
      'showDescription': true
    };

    this.each(function() {

      if (options) {
        $.extend(settings, options);
      }

      var item = this;

      var lightboxgallery = function(){

        this.items = $(item).parent().children();
        this.count = (this.items.length) - 1;
        this.index = this.items.index(item);
        this.navPrev = '';
        this.navNext = '';
        this.loaded = false;
        this.naturalWidth = 0;
        this.naturalHeight = 0;

        this.init = function() {
          this.modal();
          this.goto(this.index);
          var that = this;

          this.navNext.on('click', function(event) {
            event.preventDefault();
            that.next();
          });

          $(document).on('click', '.lightboxgallery-image', function(event){
            event.preventDefault();
            that.next();
          });

          $(document).on('click', '.lightboxgallery-modal-wrapper, .lightboxgallery-close', function(event){
            if (event.target !== this) {
              return;
            }
            event.preventDefault();
            that.close();
          });

          $(document).on('keyup', function(event) {
            if(event.keyCode == 39) {
              event.preventDefault();
              that.next();
            }

            if(event.keyCode == 37) {
              event.preventDefault();
              that.prev();
            }

            if(event.keyCode == 27) {
              event.preventDefault();
              that.close();
            }
          })

          this.navPrev.on('click', function(event) {
            event.preventDefault();
            that.prev();
          });

          $(window).on('resize', function() {
            var dimension = that.resize();
            $('.lightboxgallery-modal').css({
              width: dimension.width,
              height: dimension.height
            });
          });
        }

        this.modal = function() {
          $('<div id="lightboxgallery-modal" class="lightboxgallery-modal-wrapper"><a href="#" class="lightboxgallery-prev"><span></span></a><a href="#" class="lightboxgallery-next"><span></span></a><div class="lightboxgallery-modal"><a href="#" class="lightboxgallery-close lightboxgallery-hidden">&times;</a><div class="lightboxgallery-modal-body"></div></div></div>').appendTo($('body').addClass('lightboxgallery-modal-open'));
          this.modal = $('#lightboxgallery-modal');
          this.navNext = this.modal.find('.lightboxgallery-next');
          this.navPrev = this.modal.find('.lightboxgallery-prev');
        }

        this.close = function() {
          this.index = 0;
          this.loaded = true;
          this.naturalWidth = 0;
          this.naturalHeight = 0;

          $('#lightboxgallery-modal').fadeOut(function() {
            $(this).remove();
          });

          $('.lightboxgallery-modal').animate({
            width: 100,
            height: 100
          }, 300, function() {
            $(this).remove();
            $('body').removeClass('lightboxgallery-modal-open')
          });
        }

        // Resize modal window
        this.resize = function() {
          var maxWidth = ($(window).width()) - 80;
          var maxHeight = ($(window).height()) - 80;
          var ratio = 0;
          var width = this.naturalWidth;
          var height = this.naturalHeight;

          if(width > maxWidth){
            ratio = maxWidth / width;
            height = height * ratio;
            width = width * ratio;
          }

          if(height > maxHeight){
            ratio = maxHeight / height;
            width = width * ratio;
            height = height * ratio;
          }

          return {
            'width': width,
            'height': height
          }
        }

        // Go to next
        this.next = function() {
          if (this.index < this.count) {
            this.index = this.index + 1;
          } else {
            this.index = 0;
          }
          this.goto(this.index);
        }

        // Go to Prev
        this.prev = function() {
          if (this.index > 0) {
            this.index = this.index -1;
          } else {
            this.index = this.count;
          }
          this.goto(this.index);
        }

        // Go to index
        this.goto = function(index) {

          if(this.loaded === false) {
            var that = this;
            var $item = $(this.items[index]);
            that.loaded = true;

            $('.lightboxgallery-modal-body').html('<div class="lightboxgallery-gallery-loading"></div>');

            var img = $("<img />").attr('src', $item.attr('href')).on('load', function() {
              if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {

              } else {

                that.naturalWidth = this.naturalWidth;
                that.naturalHeight = this.naturalHeight;

                var dimension = that.resize();

                $('.lightboxgallery-modal').animate({
                  width: dimension.width,
                  height: dimension.height
                }, 300, function() {
                  var galleryHtml = '<div class="lightboxgallery-image-wrapper">';
                  galleryHtml += '<img class="lightboxgallery-image" src="'+ img[0].src +'" alt="'+ $item.attr('data-alt') +'">';

                  if((settings.showCounter) || (settings.showTitle && $item.attr('data-title')) || (settings.showDescription && $item.attr('data-desc'))) {
                    if($item.attr('data-title') || $item.attr('data-description')) {
                      galleryHtml += '<div class="lightboxgallery-image-content">';

                      if(settings.showCounter){
                        galleryHtml += '<span class="lightboxgallery-gallery-stat">'+ (that.index + 1) + ' of ' + (that.count + 1) +'</span>';
                      }

                      if(settings.showTitle && $item.attr('data-title')) {
                        galleryHtml += '<span class="lightboxgallery-image-title">'+ $item.attr('data-title') +'</span>';
                      }

                      if(settings.showDescription && $item.attr('data-desc')) {
                        galleryHtml += '<div class="lightboxgallery-image-description">'+ $item.attr('data-desc') +'</div>';
                      }

                      galleryHtml += '</div>';
                    }
                  }

                  galleryHtml += '</div>'

                  $('.lightboxgallery-modal-body').html(galleryHtml);
                  that.modal.find('.lightboxgallery-close').removeClass('lightboxgallery-hidden');
                  that.loaded = false;
                });

              }
            });
          }
        }

      }

      new lightboxgallery().init();
    });
  }

})(jQuery);
