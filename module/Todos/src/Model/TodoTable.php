<?php

namespace Todos\Model;

use Laminas\View\Model\ViewModel;
use RuntimeException;
use Laminas\Db\TableGateway\TableGatewayInterface;

class TodoTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll()
    {
        return $this->tableGateway->select();
    }

    public function getTodo($id)
    {
        $id = (int) $id;
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row = $rowset->current();
        if (! $row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveTodo(Todo $todo)
    {
        $data = [
            'name' => $todo->name,
            'priority_id'  => $todo->priority_id,
        ];

        $id = (int) $todo->id;

        if ($id === 0) {
            $this->tableGateway->insert($data);
            return;
        }

        try {
            $this->getTodo($id);
        } catch (RuntimeException $e) {
            throw new RuntimeException(sprintf(
                'Cannot update todo with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id' => $id]);
    }

    public function deleteTodo($id)
    {
        $this->tableGateway->delete(['id' => (int) $id]);
    }
}