import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addTodo } from '../features/todoSlice';
import { TextField, Button, Typography, Container, Box, IconButton, List, ListItem, ListItemText, Alert } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import axios, { AxiosError } from 'axios';
import { Subtask } from '../types/interfaces';

interface ErrorResponse {
  error: string;
}

const TodoForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title) {
      setError('Title is required');
      return;
    }
  
    const todoData = {
      title,
      description,
      subtasks: subtasks.map(subtask => ({
        ...subtask,
        status: 'waiting'
      })),
      status: 'waiting',
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', todoData);
      dispatch(addTodo(response.data));
      setTitle('');
      setDescription('');
      setSubtasks([]);
      setError(null); 
  
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.data?.error) {
        setError(axiosError.response.data.error);
        setTimeout(() => setError(null), 5000);
      } else {
        console.error(axiosError);
        setError('Server error');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const handleAddSubtask = () => {
    if (subtaskTitle) {
      setSubtasks([
        ...subtasks,
        { id: new Date().toISOString(), title: subtaskTitle, status: 'waiting' }
      ]);
      setSubtaskTitle('');
    }
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter(subtask => subtask.id !== id));
  };

  return (
    <Container>
      <Box>
        <Typography variant="h6">На  сегодня</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Название"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box display="flex" alignItems="center" marginY={2}>
          <TextField
            label="Подзадачи"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            margin="normal"
            fullWidth
          />
          <IconButton onClick={handleAddSubtask} color="primary">
            <Add />
          </IconButton>
        </Box>
        <List>
          {subtasks.map(subtask => (
            <ListItem key={subtask.id}>
              <ListItemText primary={subtask.title} />
              <IconButton edge="end" onClick={() => handleDeleteSubtask(subtask.id)} color="secondary">
                <Delete />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Добавить
        </Button>
      </Box>
    </Container>
  );
};

export default TodoForm;