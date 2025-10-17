import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Saisissez votre contenu...",
  className = ""
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Appliquer le contenu HTML au div seulement si différent et si l'éditeur n'est pas en cours d'édition
  useEffect(() => {
    if (editorRef.current && !isFocused && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  // Gérer les changements de contenu
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  // Fonctions de formatage
  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  // Fonction spéciale pour les titres
  const formatHeading = (level: number) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Créer l'élément de titre
    const heading = document.createElement(`h${level}`);
    heading.textContent = selectedText || `Titre ${level}`;
    
    // Appliquer les styles par défaut selon le niveau
    switch (level) {
      case 1:
        heading.className = 'text-4xl font-bold text-gray-900 mb-6 mt-8 leading-tight';
        break;
      case 2:
        heading.className = 'text-3xl font-bold text-gray-900 mb-4 mt-6 leading-tight';
        break;
      case 3:
        heading.className = 'text-2xl font-semibold text-gray-900 mb-3 mt-4 leading-tight';
        break;
      default:
        heading.className = 'text-xl font-semibold text-gray-900 mb-2 mt-3 leading-tight';
    }
    
    // Remplacer la sélection ou insérer à la position du curseur
    if (selectedText) {
      range.deleteContents();
    }
    range.insertNode(heading);
    
    // Placer le curseur après le titre
    const newRange = document.createRange();
    newRange.setStartAfter(heading);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    editorRef.current.focus();
    handleInput();
  };

  // Fonction spéciale pour les listes
  const createList = (ordered: boolean = false) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Créer la liste
    const list = document.createElement(ordered ? 'ol' : 'ul');
    const listItem = document.createElement('li');
    listItem.textContent = selectedText || 'Élément de liste';
    
    // Appliquer les styles avec les puces/numéros visibles
    if (ordered) {
      list.className = 'mb-4 pl-6 list-decimal list-inside';
    } else {
      list.className = 'mb-4 pl-6 list-disc list-inside';
    }
    listItem.className = 'mb-2 text-gray-700 leading-relaxed';
    
    list.appendChild(listItem);
    
    // Remplacer la sélection ou insérer à la position du curseur
    if (selectedText) {
      range.deleteContents();
    }
    range.insertNode(list);
    
    // Placer le curseur dans le premier élément de liste
    const newRange = document.createRange();
    newRange.setStart(listItem, 0);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
    
    editorRef.current.focus();
    handleInput();
  };

  // Fonction pour ajouter un élément à une liste existante
  const addListItem = () => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    // Chercher la liste parente
    let listElement = range.startContainer.parentElement;
    while (listElement && !['UL', 'OL'].includes(listElement.tagName)) {
      listElement = listElement.parentElement;
    }
    
    if (listElement) {
      // Ajouter un élément à la liste existante
      const listItem = document.createElement('li');
      listItem.textContent = selectedText || 'Nouvel élément';
      listItem.className = 'mb-2 text-gray-700 leading-relaxed';
      
      listElement.appendChild(listItem);
      
      // Placer le curseur dans le nouvel élément
      const newRange = document.createRange();
      newRange.setStart(listItem, 0);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } else {
      // Créer une nouvelle liste
      createList(false);
    }
    
    editorRef.current.focus();
    handleInput();
  };

  // Outils de formatage
  const ToolButton = ({ 
    command, 
    value, 
    icon, 
    title, 
    isActive = false 
  }: {
    command: string;
    value?: string;
    icon: string;
    title: string;
    isActive?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600'
      }`}
      title={title}
    >
      <i className={icon}></i>
    </button>
  );

  // Vérifier si un format est actif
  const isFormatActive = (command: string) => {
    return document.queryCommandState(command);
  };

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      {/* Barre d'outils */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 rounded-t-lg">
        <div className="flex flex-wrap gap-1">
          {/* Formatage de base */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <ToolButton
              command="bold"
              icon="ri-bold"
              title="Gras"
              isActive={isFormatActive('bold')}
            />
            <ToolButton
              command="italic"
              icon="ri-italic"
              title="Italique"
              isActive={isFormatActive('italic')}
            />
            <ToolButton
              command="underline"
              icon="ri-underline"
              title="Souligné"
              isActive={isFormatActive('underline')}
            />
            <ToolButton
              command="strikeThrough"
              icon="ri-strikethrough"
              title="Barré"
              isActive={isFormatActive('strikeThrough')}
            />
          </div>

          {/* Titres */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => formatHeading(1)}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Titre 1"
            >
              <i className="ri-h-1"></i>
            </button>
            <button
              type="button"
              onClick={() => formatHeading(2)}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Titre 2"
            >
              <i className="ri-h-2"></i>
            </button>
            <button
              type="button"
              onClick={() => formatHeading(3)}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Titre 3"
            >
              <i className="ri-h-3"></i>
            </button>
            <ToolButton
              command="formatBlock"
              value="p"
              icon="ri-paragraph"
              title="Paragraphe normal"
            />
          </div>

          {/* Listes */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <button
              type="button"
              onClick={() => createList(false)}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Liste à puces"
            >
              <i className="ri-list-unordered"></i>
            </button>
            <button
              type="button"
              onClick={() => createList(true)}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Liste numérotée"
            >
              <i className="ri-list-ordered"></i>
            </button>
            <button
              type="button"
              onClick={addListItem}
              className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
              title="Ajouter un élément de liste"
            >
              <i className="ri-add-line"></i>
            </button>
          </div>

          {/* Alignement */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <ToolButton
              command="justifyLeft"
              icon="ri-align-left"
              title="Aligner à gauche"
            />
            <ToolButton
              command="justifyCenter"
              icon="ri-align-center"
              title="Centrer"
            />
            <ToolButton
              command="justifyRight"
              icon="ri-align-right"
              title="Aligner à droite"
            />
            <ToolButton
              command="justifyFull"
              icon="ri-align-justify"
              title="Justifier"
            />
          </div>

          {/* Couleurs */}
          <div className="flex border-r border-gray-300 pr-2 mr-2">
            <ToolButton
              command="foreColor"
              value="#ef4444"
              icon="ri-text"
              title="Couleur du texte"
            />
            <ToolButton
              command="backColor"
              value="#fef3c7"
              icon="ri-text-color"
              title="Couleur de fond"
            />
          </div>

          {/* Actions */}
          <div className="flex">
            <ToolButton
              command="removeFormat"
              icon="ri-format-clear"
              title="Supprimer le formatage"
            />
            <ToolButton
              command="undo"
              icon="ri-arrow-go-back-line"
              title="Annuler"
            />
            <ToolButton
              command="redo"
              icon="ri-arrow-go-forward-line"
              title="Refaire"
            />
          </div>
        </div>
      </div>

      {/* Zone d'édition */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`min-h-[300px] p-4 focus:outline-none ${
          isFocused ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
        }`}
        style={{
          lineHeight: '1.6',
          fontSize: '16px'
        }}
        data-placeholder={placeholder}
      />

      {/* Styles par défaut pour les éléments dans l'éditeur */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [contenteditable] h1 {
            font-size: 2.25rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 1.5rem;
            margin-top: 2rem;
            line-height: 1.1;
          }
          [contenteditable] h2 {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 1rem;
            margin-top: 1.5rem;
            line-height: 1.1;
          }
          [contenteditable] h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.75rem;
            margin-top: 1rem;
            line-height: 1.1;
          }
          [contenteditable] p {
            margin-bottom: 1rem;
            color: #374151;
            line-height: 1.6;
          }
          [contenteditable] ul {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
            list-style-type: disc;
            list-style-position: inside;
          }
          [contenteditable] ol {
            margin-bottom: 1rem;
            padding-left: 1.5rem;
            list-style-type: decimal;
            list-style-position: inside;
          }
          [contenteditable] li {
            margin-bottom: 0.5rem;
            color: #374151;
            line-height: 1.6;
            display: list-item;
          }
          [contenteditable] strong {
            font-weight: 700;
          }
          [contenteditable] em {
            font-style: italic;
          }
          [contenteditable] u {
            text-decoration: underline;
          }
          [contenteditable] s {
            text-decoration: line-through;
          }
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            font-style: italic;
          }
        `
      }} />

    </div>
  );
}
