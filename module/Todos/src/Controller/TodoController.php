<?php

namespace Todos\Controller;

use Laminas\Db\Adapter\Driver\Mysqli\Result;
use Laminas\Db\ResultSet\AbstractResultSet;
use Laminas\Db\ResultSet\ResultSetInterface;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;
use Laminas\View\Model\ViewModel;
use Todos\Model\TodoTable;

class TodoController extends AbstractActionController
{
    // Add this property:
    private $table;

    // Add this constructor:
    public function __construct(TodoTable $table)
    {
        $this->table = $table;
    }

    public function indexAction()
    {
//        return new ViewModel([
//            'todos' => $this->table->fetchAll(),
//        ]);

//        return new JsonModel([
//            'status' => 'SUCCESS',
//            'message'=>'Here is your data',
//            'data' => [
//                'full_name' => 'John Doe',
//                'address' => '51 Middle st.'
//            ]
//        ]);

        /* @var $r AbstractResultSet */
        $r = $this->table->fetchAll();

        $todos = [];
        foreach ($r as $row){
            $todos[] = $row;
        }

        return new JsonModel($todos);
    }

    public function addAction()
    {
    }

    public function editAction()
    {
    }

    public function deleteAction()
    {
    }
}