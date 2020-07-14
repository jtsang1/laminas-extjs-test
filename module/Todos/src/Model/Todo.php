<?php

namespace Todos\Model;

class Todo
{
    public $id;
    public $title;
    public $created_at;
    public $priority_id;

    public function exchangeArray(array $data)
    {
        $this->id     = !empty($data['id']) ? $data['id'] : null;
        $this->title = !empty($data['title']) ? $data['title'] : null;
        $this->created_at  = !empty($data['created_at']) ? $data['created_at'] : null;
        $this->priority_id  = !empty($data['priority_id']) ? $data['priority_id'] : null;
    }
}