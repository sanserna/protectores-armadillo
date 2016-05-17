var app = app || {};
app.templates = {};

app.templates.productCotizacion = '<div class="productos-cotizacion__producto" ctzn-product>' +
    '  <p class="normal-text" ctzn-product-name>{{nombreProducto}}</p>' +
    '  <p class="normal-text" ctzn-product-num>{{numProducto}}</p>' +
    '  <button ctzn-product-close>X</button>' +
    '</div>';
