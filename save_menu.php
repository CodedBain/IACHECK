<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = file_get_contents("php://input");
    file_put_contents("menu.json", $data);
    echo "Menú guardado correctamente.";
} else {
    http_response_code(405);
    echo "Método no permitido.";
}
?>