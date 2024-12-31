import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Superscript, Subscript, Link
} from 'lucide-react';

const ToolbarButton = React.memo(({ icon: Icon, isActive, onClick, tooltip }) => (
  <button
    type="button"
    className={`p-1 rounded hover:bg-gray-100 ${
      isActive ? 'bg-gray-200' : ''
    }`}
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    title={tooltip}
    aria-label={tooltip}
  >
    <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-700'} />
  </button>
));

const RichTextEditor = React.memo(({ value, onChange, placeholder, minHeight = "100px" }) => {
  const editorRef = useRef(null);
  const [editorState, setEditorState] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontSize: '12',
    align: 'left',
  });

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleExecCommand = useCallback((command, value = null) => {
    if (!editorRef.current) return;
    
    editorRef.current.focus();
    document.execCommand(command, false, value);
    
    setEditorState(prev => {
      const newState = { ...prev };
      switch (command) {
        case 'bold':
          newState.bold = document.queryCommandState('bold');
          break;
        case 'italic':
          newState.italic = document.queryCommandState('italic');
          break;
        case 'underline':
          newState.underline = document.queryCommandState('underline');
          break;
        case 'strikeThrough':
          newState.strikethrough = document.queryCommandState('strikeThrough');
          break;
        case 'justifyLeft':
        case 'justifyCenter':
        case 'justifyRight':
        case 'justifyFull':
          newState.align = command.replace('justify', '').toLowerCase();
          break;
        default:
          break;
      }
      return newState;
    });
    
    const newContent = editorRef.current.innerHTML;
    if (typeof onChange === 'function' && newContent !== value) {
      onChange(newContent);
    }
  }, [onChange, value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    
    const newContent = editorRef.current.innerHTML;
    if (typeof onChange === 'function' && newContent !== value) {
      onChange(newContent);
    }
  }, [onChange, value]);

  const handleFontChange = useCallback((e) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('fontName', false, e.target.value);
  }, []);

  const handleFontSizeChange = useCallback((e) => {
    const size = e.target.value;
    if (!editorRef.current) return;
    
    try {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      
      const range = selection.getRangeAt(0);
      const selectedContent = range.toString();
      
      // Si hay texto seleccionado
      if (selectedContent) {
        // Crear el contenedor con el nuevo tamaño
        const newElement = document.createElement('span');
        newElement.style.fontSize = `${size}px`;
        
        // Eliminar el contenido actual
        range.deleteContents();
        
        // Insertar el nuevo contenido con el tamaño actualizado
        const textNode = document.createTextNode(selectedContent);
        newElement.appendChild(textNode);
        range.insertNode(newElement);
        
        // Colocar el cursor al final del texto insertado
        selection.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(newElement);
        newRange.collapse(false);
        selection.addRange(newRange);
      } else {
        // Si no hay selección, crear un nuevo span para el siguiente texto
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        
        // Agregar un espacio invisible para mantener el cursor
        const zeroSpace = document.createTextNode('\u200B');
        span.appendChild(zeroSpace);
        
        range.insertNode(span);
        
        // Mover el cursor dentro del nuevo span
        const newRange = document.createRange();
        newRange.setStart(span.firstChild, 1);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
      
      // Actualizar estado y notificar cambios
      setEditorState(prev => ({ ...prev, fontSize: size }));
      
      const newContent = editorRef.current.innerHTML;
      if (typeof onChange === 'function' && newContent !== value) {
        onChange(newContent);
      }
    } catch (error) {
      console.error('Error al cambiar el tamaño de fuente:', error);
      
      // Método de respaldo usando execCommand
      document.execCommand('fontSize', false, '7');
      // Aplicar el tamaño real usando CSS
      const fontElements = editorRef.current.getElementsByTagName('font');
      if (fontElements.length > 0) {
        const lastFont = fontElements[fontElements.length - 1];
        lastFont.style.fontSize = `${size}px`;
        lastFont.removeAttribute('size');
      }
      
      setEditorState(prev => ({ ...prev, fontSize: size }));
    }
  }, [onChange, value]);

  const handleLinkClick = useCallback(() => {
    const url = prompt('Ingrese la URL:');
    if (url) handleExecCommand('createLink', url);
  }, [handleExecCommand]);

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50">
        <select 
          className="px-2 py-1 border rounded text-sm"
          defaultValue="Aptos"
          onChange={handleFontChange}
          aria-label="Seleccionar fuente"
        >
          <option>Aptos</option>
          <option>Arial</option>
          <option>Times New Roman</option>
          <option>Calibri</option>
        </select>
        
        <select 
          className="px-2 py-1 border rounded text-sm"
          value={editorState.fontSize}
          onChange={handleFontSizeChange}
          aria-label="Seleccionar tamaño de fuente"
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 30, 36].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={Bold}
          isActive={editorState.bold}
          onClick={() => handleExecCommand('bold')}
          tooltip="Negrita"
        />
        <ToolbarButton
          icon={Italic}
          isActive={editorState.italic}
          onClick={() => handleExecCommand('italic')}
          tooltip="Cursiva"
        />
        <ToolbarButton
          icon={Underline}
          isActive={editorState.underline}
          onClick={() => handleExecCommand('underline')}
          tooltip="Subrayado"
        />
        <ToolbarButton
          icon={Strikethrough}
          isActive={editorState.strikethrough}
          onClick={() => handleExecCommand('strikeThrough')}
          tooltip="Tachado"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={AlignLeft}
          isActive={editorState.align === 'left'}
          onClick={() => handleExecCommand('justifyLeft')}
          tooltip="Alinear a la izquierda"
        />
        <ToolbarButton
          icon={AlignCenter}
          isActive={editorState.align === 'center'}
          onClick={() => handleExecCommand('justifyCenter')}
          tooltip="Centrar"
        />
        <ToolbarButton
          icon={AlignRight}
          isActive={editorState.align === 'right'}
          onClick={() => handleExecCommand('justifyRight')}
          tooltip="Alinear a la derecha"
        />
        <ToolbarButton
          icon={AlignJustify}
          isActive={editorState.align === 'justify'}
          onClick={() => handleExecCommand('justifyFull')}
          tooltip="Justificar"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={List}
          onClick={() => handleExecCommand('insertUnorderedList')}
          tooltip="Lista con viñetas"
        />
        <ToolbarButton
          icon={ListOrdered}
          onClick={() => handleExecCommand('insertOrderedList')}
          tooltip="Lista numerada"
        />

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton
          icon={Quote}
          onClick={() => handleExecCommand('formatBlock', '<blockquote>')}
          tooltip="Cita"
        />
        <ToolbarButton
          icon={Superscript}
          onClick={() => handleExecCommand('superscript')}
          tooltip="Superíndice"
        />
        <ToolbarButton
          icon={Subscript}
          onClick={() => handleExecCommand('subscript')}
          tooltip="Subíndice"
        />
        <ToolbarButton
          icon={Link}
          onClick={handleLinkClick}
          tooltip="Insertar enlace"
        />
      </div>

      <div
        ref={editorRef}
        className="p-4 focus:outline-none"
        style={{ 
          minHeight,
          wordBreak: 'break-word'
        }}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        role="textbox"
        aria-multiline="true"
        aria-label={placeholder}
      />
    </div>
  );
});

const PostForm = ({ initialData, onChange, isSubmitting }) => {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    available: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setPostData(initialData);
    }
  }, [initialData]);

  const validateField = useCallback((name, value) => {
    const plainText = value.replace(/<[^>]*>/g, '').trim();
    switch (name) {
      case "title":
        return plainText === "" ? "El título es requerido" : "";
      case "content":
        return plainText === "" ? "El contenido es requerido" : "";
      default:
        return "";
    }
  }, []);

  const handleChange = useCallback((name, value) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const updatedData = {
      ...postData,
      [name]: value
    };

    setPostData(updatedData);

    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));

    if (!fieldError && typeof onChange === 'function') {
      onChange(updatedData);
    }
  }, [postData, onChange, validateField]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg relative">
      <h2 className="text-2xl font-semibold mb-6">Información del Post</h2>

      <div className="grid grid-cols-1 gap-6">
        <div className="mb-4">
          <label 
            htmlFor="title-editor" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Título
          </label>
          <RichTextEditor
            value={postData.title}
            onChange={(value) => handleChange('title', value)}
            placeholder="Escribe el título del post"
            minHeight="50px"
          />
          {touched.title && errors.title && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.title}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label 
            htmlFor="content-editor" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contenido
          </label>
          <RichTextEditor
            value={postData.content}
            onChange={(value) => handleChange('content', value)}
            placeholder="Escribe el contenido del post"
            minHeight="200px"
          />
          {touched.content && errors.content && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.content}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
            <input
              type="checkbox"
              id="available"
              checked={postData.available}
              onChange={(e) => handleChange('available', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label
              htmlFor="available"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Disponible para publicación
            </label>
          </div>
        </div>
      </div>

      {isSubmitting && (
        <div 
          className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center"
          role="progressbar"
          aria-valuetext="Enviando formulario"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default PostForm;