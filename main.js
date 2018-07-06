document.addEventListener("DOMContentLoaded", function () {
    let width = 500;
    let height = 300;
    let base_line = height - 50;
    let tau = Math.PI * 2;

    let items = [];

    $('input').each(function(){
        var image = $(this).data('image');
        items.push({
            id: this.id,
            image: image
        })
    });

    let draw = SVG("stage").viewbox(0, 0, width, height);

    function handleState(id, state, delay) {
        var item_element = $('.item[data-id="' + id + '"]');
        var line_element = $('line[data-id="' + id + '"]');

        if (!item_element.length) {
            console.log('cant find that one', id);
            return;
        }

        var item = item_element[0].instance;
        var line = line_element[0].instance;

        if (!state) {
            item.animate({
                ease: '<>',
                delay
            })
            .center(0, 0)
            .attr({ 
                opacity: 1
            });

            line.animate({
                ease: '<>',
                delay
            }).attr({ 
                x1: 0, 
                y1: 0, 
                opacity: 0
            });

            return;
        }

        var position = item.data('position');
        var outer_arc = item.data('outer');

        var parent_element = item_element.parent();
        var items = $('.item', parent_element);
        
        var arc_element = $('.arc', parent_element)
        var arc = arc_element[0].instance;
        var arc_length = arc.length();

        var segments = items.length - 1;
        var position_distance = arc_length / segments;

        if (!outer_arc)  {
            position_distance = arc_length / (items.length * 2);
            position *= 2;
            position += 1;
        }
        
        var point = arc.pointAt(position_distance * position);

        item.animate({
            ease: '<>',
            delay
        }).center(point.x, point.y)
        .attr({ 
            opacity: 1
        });

        line.animate({
            ease: '<>',
            delay
        }).attr({
            x1: point.x,
            y1: point.y,
            opacity: 1
        });
    }

    setTimeout(function(){
        $('input').each(function(index, item){
            setTimeout(function(){
                item.click();
            }, 100 * index)
        })

        setTimeout(function(){
            $('input').each(function(index, item){
                setTimeout(function(){
                    item.click();
                }, 100 * index)
            })
        }, $('input').length * 50);
    }, 0)

    $('input').on('change', function(index){
        handleState(this.id, this.checked);
    });

    var outer = drawArc(width / 2, base_line, tau * 0.5, tau, 200, false);
    var inner = drawArc(width / 2, base_line, tau * 0.5, tau, 150, true);

    let icon = 
        draw.image('/assets/_all/large_72/cashStack.png', 72, 72)
            .center(width / 2, base_line)
            .stroke({ 
                width: 2, 
                color: '#444', 
                dasharray: '5,5' 
            })

    var outer_items = 0;
    var inner_items = 0;

    items.forEach(function(item, position) {
        let outer_item = position % 2 === 0;
        
        let arc = outer_item ? outer : inner;
        let item_group = arc.group;

        // Create the line
        let line = item_group.line(0, 0, 0, 0);
        line
            .stroke({ 
                width: 1, 
                color: '#dedede', 
                dasharray: '5,5' 
            })
            .attr({ 
                opacity: 0
            })

            line.addClass('line')
            line.data('id', item.id);
            
        //let item_holder = item_group.image('/assets/_all/large_72/' + item.image, 48, 48);
        let item_holder = item_group.image('/assets/_all/small_24/' + item.image, 24, 24);
        
        item_holder.center(0, 0)
        .attr({ 
            opacity: 1
        });

        item_holder.addClass('item')
        item_holder.data('arc', outer_item ? 'outer' : 'inner');
        item_holder.data('position', outer_item ? outer_items : inner_items);
        item_holder.data('id', item.id);
        item_holder.data('outer', outer_item);

        if (outer_item) {
            outer_items++;
        } else {
            inner_items++;
        }
    })

    function drawArc(x, y, startAngle, endAngle, radius, inside) {

        let group = 
            draw.group()
                .center(x, y)
                .fill('none')
                .addClass(inside ? 'inner' : 'outer');

        let startPoint = polarToCartesian(startAngle, radius);
        let endPoint = polarToCartesian(endAngle, radius);
        let large = true;
        let clockwise = true;

        let arc_array = new SVG.PathArray([
            ['M', startPoint[0], startPoint[1]],
            ['A', 
                radius, 
                radius, 
                0,
                large ? 1 : 0,
                clockwise ? 1 : 0,
                endPoint[0],
                endPoint[1]]
        ]);

        let arc = group.path(arc_array);
        
        arc.stroke({
            color: 'red',
            width: 0
        })

        arc.addClass('arc')

        return {
            group: group,
            arc: arc
        };
    }

    function polarToCartesian(angle, radius) {
        return [
            radius * Math.cos(angle),
            radius * Math.sin(angle)
        ]
    }

});
