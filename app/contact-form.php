<?php

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$mensaje = $_POST['mensaje'];

$subject = "Contacto pagina web Protectores Armadillo";

$dest = "protectores@protectoresarmadillo.com";

// cuerpo del mensaje que se recibe
$cuerpo = '
<h2 style="max-width: 500px; padding: 0px; margin: 0px;">Tienes un nuevo mensaje!</h2>
<table rules="none" style="min-width: 400px; max-width: 700px; border-collapse: collapse; padding: 0px;">
    <tr style="padding: 0px;">
        <td style="padding-right: 5px; padding-top: 20px; width: 10px;" valign="top"><h3 style="color: #F1C40F; padding: 0px; padding-top: 10px; margin: 0px;"><strong>Nombre:</strong></h3></td>
    </tr>
    <tr style="padding: 0px;">
      <td style="padding-right: 5px; padding-top: 5px; width: 100px;" valign="top">'.$nombre.'</td>
    </tr>
    <tr style="padding: 0px;">
        <td style="padding-right: 5px; padding-top: 20px; width: 10px;" valign="top"><h3 style="color: #F1C40F; padding: 0px; padding-top: 10px; margin: 0px;"><strong>Email:</strong></h3></td>
    </tr>
    <tr style="padding: 0px;">
      <td style="padding-right: 5px; padding-top: 5px; width: 100px;" valign="top">'.$email.'</td>
    </tr>
    <tr style="padding: 0px;">
        <td style="padding-right: 5px; padding-top: 20px; width: 10px;" valign="top"><h3 style="color: #F1C40F; padding: 0px; padding-top: 10px; margin: 0px;"><strong>Mensaje:</strong></h3></td>
    </tr>
    <tr style="padding: 0px;">
        <td style="padding-right: 5px; padding-top: 5px; width: 10px;" valign="top">'.$mensaje.'</td>
    </tr>
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