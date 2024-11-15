<?php
// Copyright (C) 2021-2024 Solution Libre
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
// 
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mime\Email;
use Symfony\Component\HttpFoundation\Response;

//Load Composer's autoloader
require '../../vendor/autoload.php';

$dotenv = new Dotenv();
$dotenv->load('../../.env');

$response = new Response();
$response->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR);
$response->headers->set('Content-Type', 'application/json');

$message = 'Problème serveur';

# Check for empty fields
if(
    empty($_POST['name'])
    || empty($_POST['email'])
    || empty($_POST['message'])
    || !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL)
) {
    $message = 'Veuillez renseigner tous les champs requis.';
} else {
    $name = strip_tags(htmlspecialchars($_POST['name']));
    $email_address = strip_tags(htmlspecialchars($_POST['email']));
    $phone = strip_tags(htmlspecialchars($_POST['phone']));
    $message = strip_tags(htmlspecialchars($_POST['message']));
    
    $transport = Transport::fromDsn($_ENV['MAILER_DSN']);
    $mailer = new Mailer($transport);
    
    $email = (new Email())
        ->from('no-reply@solution-libre.fr')
        ->to('webmaster@solution-libre.fr')
        ->replyTo($email_address)
        ->subject("Website Contact Form:  $name")
        ->text("You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message");
    
    try {
        $mailer->send($email);
        $message = "Courriel expédié.";
        $response->setStatusCode(Response::HTTP_OK);
    } catch (TransportExceptionInterface $e) {
        $message = "Problème serveur lors de l'émission du courriel.";
    }    
}

$response->setContent(json_encode([
    'message' => $message,
]));

$response->send();
