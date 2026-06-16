import { describe, it, expect } from 'vitest';
import { variableReducer } from '../src/components/VariableTable';
import type { Variable } from '../src/types';

describe('variableReducer', () => {
  it('should add a new row with ADD_ROW', () => {
    const state: Variable[] = [];
    const newState = variableReducer(state, { type: 'ADD_ROW' });
    expect(newState).toHaveLength(1);
    expect(newState[0].index).toBe(1);
    expect(newState[0].name).toBe('');
    expect(newState[0].dataType).toBe('');
    expect(newState[0].defaultValue).toBe('');
    expect(newState[0].comment).toBe('');
  });

  it('should add multiple rows with incrementing index', () => {
    let state: Variable[] = [];
    state = variableReducer(state, { type: 'ADD_ROW' });
    state = variableReducer(state, { type: 'ADD_ROW' });
    state = variableReducer(state, { type: 'ADD_ROW' });
    expect(state).toHaveLength(3);
    expect(state[0].index).toBe(1);
    expect(state[1].index).toBe(2);
    expect(state[2].index).toBe(3);
  });

  it('should delete a row and reindex with DELETE_ROW', () => {
    let state: Variable[] = [];
    state = variableReducer(state, { type: 'ADD_ROW' });
    state = variableReducer(state, { type: 'ADD_ROW' });
    state = variableReducer(state, { type: 'ADD_ROW' });

    const idToDelete = state[1].id; // delete the second row
    state = variableReducer(state, { type: 'DELETE_ROW', id: idToDelete });

    expect(state).toHaveLength(2);
    expect(state[0].index).toBe(1);
    expect(state[1].index).toBe(2);
  });

  it('should update a cell value with UPDATE_CELL', () => {
    let state: Variable[] = [];
    state = variableReducer(state, { type: 'ADD_ROW' });
    const id = state[0].id;

    state = variableReducer(state, {
      type: 'UPDATE_CELL',
      id,
      field: 'name',
      value: 'myVar',
    });
    expect(state[0].name).toBe('myVar');

    state = variableReducer(state, {
      type: 'UPDATE_CELL',
      id,
      field: 'dataType',
      value: 'INT',
    });
    expect(state[0].dataType).toBe('INT');

    state = variableReducer(state, {
      type: 'UPDATE_CELL',
      id,
      field: 'defaultValue',
      value: '42',
    });
    expect(state[0].defaultValue).toBe('42');

    state = variableReducer(state, {
      type: 'UPDATE_CELL',
      id,
      field: 'comment',
      value: 'Test comment',
    });
    expect(state[0].comment).toBe('Test comment');
  });

  it('should not modify other rows when updating a cell', () => {
    let state: Variable[] = [];
    state = variableReducer(state, { type: 'ADD_ROW' });
    state = variableReducer(state, { type: 'ADD_ROW' });

    const firstId = state[0].id;
    state = variableReducer(state, {
      type: 'UPDATE_CELL',
      id: firstId,
      field: 'name',
      value: 'changed',
    });

    expect(state[0].name).toBe('changed');
    expect(state[1].name).toBe('');
  });
});
