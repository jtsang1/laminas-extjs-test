<?php

namespace Todos\Controller;

use Laminas\Db\Adapter\Driver\Mysqli\Result;
use Laminas\Db\ResultSet\AbstractResultSet;
use Laminas\Db\ResultSet\ResultSetInterface;
use Laminas\Mvc\Controller\AbstractActionController;
use Laminas\View\Model\JsonModel;
use Laminas\View\Model\ViewModel;
use Todos\Model\Todo;
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
        $request = $this->getRequest();

        if($request->isGet()) {

//            return new ViewModel([
//                'todos' => $this->table->fetchAll(),
//            ]);
//
//            return new JsonModel([
//                'status' => 'SUCCESS',
//                'message'=>'Here is your data',
//                'data' => [
//                    'full_name' => 'John Doe',
//                    'address' => '51 Middle st.'
//                ]
//            ]);

            /* @var $r AbstractResultSet */
            $r = $this->table->fetchAll();

            $todos = [];
            foreach ($r as $row) {
                $todos[] = $row;
            }

            return new JsonModel($todos);
        }

        elseif ($request->isPost()){

            $params = json_decode($request->getContent(), true);
            //var_dump(json_encode($params));die();
            $todo = new Todo();
            $todo->exchangeArray($params);
            $todo_id = $this->table->saveTodo($todo);

            $todo = $this->table->getTodo($todo_id);

            return new JsonModel((array)$todo);
        }
    }

    public function editAction()
    {
        $request = $this->getRequest();

        if ($request->isPut()){

            $id = (int) $this->params()->fromRoute('id', 0);

            $params = json_decode($request->getContent(), true);

            if($id != $params['id']){
                $this->getResponse()->setStatusCode(422);
                return new JsonModel([
                    "error" => 'id does not match'
                ]);
            }

            //var_dump(json_encode($params));die();
            $todo = new Todo();
            $todo->exchangeArray($params);
            $todo_id = $this->table->saveTodo($todo);

            $todo = $this->table->getTodo($todo_id);

            return new JsonModel((array)$todo);
        }
    }

    public function deleteAction()
    {
        $request = $this->getRequest();

        if ($request->isDelete()) {

            $id = (int) $this->params()->fromRoute('id', 0);

            $this->table->deleteTodo($id);

            return new JsonModel([
                "success" => true
            ]);
        }
    }
}