<?php

$data = json_decode($_POST['data'],true);
$nombre = $data['nombre'];
$email = $data['email'];
$products = '';

$subject = "Solicitud de Cotización pagina web Protectores Armadillo";

$dest = "protectores@protectoresarmadillo.com";

foreach ($data["items"] as $item) {
   $products .= '
   <tr>
    <td style="padding: 10px; margin: 0px; color: #F1C40F;" valign="top"><strong>'.$item["nombreProducto"].'</strong></td>
    <td style="padding: 10px; margin: 0px; text-align: center;" valign="top">'.$item["cantidadProducto"].' unidades</td>
   </tr>
   ';
}

// cuerpo del mensaje que se recibe
$cuerpo = '
<h2 style="max-width: 500px; padding: 15px 0px;">Se ha recibido una solicitud de cotización:</h2>
<h3 style="max-width: 500px; padding: 15px 0px 0px 0px; font-weight: normal;">Nombre: <em>'.$nombre.'</h3>
<h3 style="max-width: 500px; padding: 15px 0px; font-weight: normal;">Email: <em>'.$email.'</em></h3>
<table rules="all" style="border: 1px solid #000; min-width: 400px; max-width: 700px;" cellpadding="10">
  <thead>
    <tr>
      <th style="background-color: #eee; min-width: 200px; padding: 5px;">Nombre del Producto</th>
      <th style="background-color: #eee; min-width: 200px; padding: 5px;">Cantidad</th>
    </tr>
  </thead>
  <tbody>'.$products.'</tbody>
</table>
<br />
<br />
<p style="padding: 0px; margin: 0px;">Enviado desde www.protectoresarmadillo.com</strong></p>
';

// definir cabeceras
$headers = "From: $nombre <$email>\n";
$headers .= "X-Mailer: PHP5\n";
$headers .= 'MIME-Version: 1.0'."\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1'."\r\n";

mail($dest,$subject,$cuerpo,$headers);

?>