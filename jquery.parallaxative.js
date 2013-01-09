(function(jQuery) {
	jQuery.fn.parallaxative = function(options) {
		return this.each(function() {
			
			/*
			 */
			function resizeViewport() {
				var layerHeightMax = 1;
				
				layers.each(function() {
					var layer = jQuery(this);
				
					var scaleText = layer.attr('data-parallaxative-scale') || '';
					
					if(scaleMatches = scaleText.match(/^([0-9\.]+),([0-9\.]+)$/)) {
						var layerWidth = Math.round(viewport.width() * scaleMatches[1]);
						var layerHeight = Math.round(viewport.width() * scaleMatches[2]);
						
						layer.css({
							width: layerWidth + 'px',
							height: layerHeight + 'px'
						});
						
						jQuery('img', layer).css({
							width: layerWidth + 'px',
							height: layerHeight + 'px'
						});

						layerHeightMax = Math.max(layerHeightMax, layerHeight);
					}
				});
				
				viewport.css('height', layerHeightMax + 'px');
				
				updateLayers();
			}
			
				
			/*
			 */
			function updateLayers() {
				layers.each(function() {
					var layer = jQuery(this);
					
					layer.css({
						left: (position.x * 100) + '%',
						marginLeft: ((position.x * layer.width()) * -1) + 'px',
						top: (position.y * 100) + '%',
						marginTop: ((position.y * layer.height()) * -1) + 'px'
					});
				});
			}


			/*
			 */
			function changePosition(x, y) {
				if(options.moveX) {
					position.x = Math.max(0, Math.min(1, x));
				}
				
				if(options.moveY) {
					position.y = Math.max(0, Math.min(1, y));
				}

				updateLayers();
			}
			
			
			/*
			 */
			function changePositionByAngle(x, y) {
				if(angleInitial === null) {
					angleInitial = {
						x: x,
						y: y
					};
					
					return;
				}
				
				var deltaX = angleInitial.x - x;
				var deltaY = angleInitial.y - y;
				
				if((Math.abs(deltaX) < options.motionThreshold) && (Math.abs(deltaY) < options.motionThreshold)) {
					return;
				}
				
				if(1) { // landscape
					var deltaTemp = deltaX;
					deltaX = deltaY;
					deltaY = deltaTemp;
				}
				
				changePosition(
					(deltaX * (1 / options.motionAngleRange)) + 0.5,
					(deltaY * (1 / options.motionAngleRange)) + 0.5
					);
			}

			options = jQuery.extend(
				{},
				jQuery.fn.parallaxative.optionsDefault,
				options
			);
			
			var viewport = jQuery(this);
			var layers = viewport.children();

			viewport.css({
				position: 'relative',
				overflow: 'hidden'
			});

			layers.css('position', 'absolute');

			var position = {
				x: 0.5,
				y: 0.5
			};
			
			var angleInitial = null;
			
			// Window Resize Response
			jQuery(window).resize(function() {
				resizeViewport();
			});

			// Mouse Response
			viewport.bind(
				'mousemove',
				function(event) {
					var viewportOffset = viewport.offset();
					
					changePosition(
						(event.pageX - viewportOffset.left) / viewport.width(),
						(event.pageY - viewportOffset.top) / viewport.height()
						);
				}
			);
			
			if(window.DeviceOrientationEvent) {
				jQuery(window).bind(
					'deviceorientation',
					function(event) {
						var angleX = event.originalEvent.gamma;
						var angleY = event.originalEvent.beta;
						
						changePositionByAngle(angleX, angleY);
					}
				);
			} else if(window.OrientationEvent) {
				jQuery(window).bind(
					'MozOrientation',
					function(event) {
						var angleX = event.originalEvent.x * 90;
						var angleY = event.originalEvent.y * -90;

						changePositionByAngle(angleX, angleY);
					}
				);
			} else if(window.DeviceMotionEvent) {
				jQuery(window).bind(
					'devicemotion',
					function(event) {
						var acceleration = event.originalEvent.accelerationIncludingGravity;
							
						var angleX = Math.round(((acceleration.x) / 9.81) * -90);
						var angleY = Math.round(((acceleration.y + 9.81) / 9.81) * 90 * ((acceleration.z > 0) ? 1 : -1));
							
						changePositionByAngle(angleX, angleY);
					}
				);
			}

			// Go for it
			resizeViewport();
		});
	};

	// Default options
	jQuery.fn.parallaxative.optionsDefault = {
		moveX: false,
		moveY: false,
		motionThreshold: 1.2,
		motionAngleRange: 20
	};

	// RUN
	jQuery(function() {});
})(jQuery);