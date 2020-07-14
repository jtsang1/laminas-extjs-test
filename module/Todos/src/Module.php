<?php

namespace Todos;

use Laminas\Db\Adapter\AdapterInterface;
use Laminas\Db\ResultSet\ResultSet;
use Laminas\Db\TableGateway\TableGateway;
use Laminas\ModuleManager\Feature\ConfigProviderInterface;
use Laminas\Mvc\MvcEvent;

class Module implements ConfigProviderInterface
{
//    /**
//     * @param  MvcEvent $e The MvcEvent instance
//     * @return void
//     */
//    public function onBootstrap(MvcEvent $e)
//    {
//        // Register a "render" event, at high priority (so it executes prior
//        // to the view attempting to render)
//        $app = $e->getApplication();
//        $app->getEventManager()->attach('render', [$this, 'registerJsonStrategy'], 100);
//    }
//
//    /**
//     * @param  MvcEvent $e The MvcEvent instance
//     * @return void
//     */
//    public function registerJsonStrategy(MvcEvent $e)
//    {
//        $app          = $e->getTarget();
//        $locator      = $app->getServiceManager();
//        $view         = $locator->get('Laminas\View\View');
//        $jsonStrategy = $locator->get('ViewJsonStrategy');
//
//        // Attach strategy, which is a listener aggregate, at high priority
//        $jsonStrategy->attach($view->getEventManager(), 100);
//    }

    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function getServiceConfig()
    {
        return [
            'factories' => [
                Model\TodoTable::class => function($container) {
                    $tableGateway = $container->get(Model\TodoTableGateway::class);
                    return new Model\TodoTable($tableGateway);
                },
                Model\TodoTableGateway::class => function ($container) {
                    $dbAdapter = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Todo());
                    return new TableGateway('todos', $dbAdapter, null, $resultSetPrototype);
                },
            ],
        ];
    }

    // Add this method:
    public function getControllerConfig()
    {
        return [
            'factories' => [
                Controller\TodoController::class => function($container) {
                    return new Controller\TodoController(
                        $container->get(Model\TodoTable::class)
                    );
                },
            ],
        ];
    }
}