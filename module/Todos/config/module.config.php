<?php

namespace Todos;

use Laminas\Router\Http\Segment;
use Laminas\ServiceManager\Factory\InvokableFactory;

return [
    /*'controllers' => [
        'factories' => [
            Controller\TodoController::class => InvokableFactory::class,
        ],
    ],*/

    // The following section is new and should be added to your file:
    'router' => [
        'routes' => [
            'todo' => [
                'type'    => Segment::class,
                'options' => [
                    'route' => '/todo[/:action[/:id]]',
                    'constraints' => [
                        'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                        'id'     => '[0-9]+',
                    ],
                    'defaults' => [
                        'controller' => Controller\TodoController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],

    'view_manager' => [

        'strategies' => [
            'ViewJsonStrategy',
        ],

        'template_path_stack' => [
            'todo' => __DIR__ . '/../view',
        ],
    ],
];