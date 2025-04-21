// src/extension.ts: Contiene la lógica principal de la extensión.

import * as vscode from 'vscode';

/**
 * Elimina la sintaxis Markdown básica de una cadena de texto.
 * Nota: Este es un analizador simple y puede no manejar todos los casos complejos de Markdown.
 * @param markdownText El texto con sintaxis Markdown.
 * @returns El texto sin la sintaxis Markdown básica.
 */
function stripMarkdown(markdownText: string): string {
    let plainText = markdownText;

    // Eliminar encabezados (ej: # Título)
    plainText = plainText.replace(/^#+\s+/gm, '');

    // Eliminar reglas horizontales (ej: ---, ***)
    plainText = plainText.replace(/^[-*_]{3,}$/gm, '');

    // Eliminar citas en bloque (ej: > Texto)
    plainText = plainText.replace(/^>\s+/gm, '');

    // Eliminar marcadores de lista (ej: -, *, +, 1.)
    plainText = plainText.replace(/^[*-+]\s+/gm, '');
    plainText = plainText.replace(/^\d+\.\s+/gm, '');

    // Eliminar bloques de código (multilínea)
    plainText = plainText.replace(/```[\s\S]*?```/g, '');

    // Eliminar spans de código (en línea)
    plainText = plainText.replace(/`[^`]*`/g, '');

    // Eliminar enlaces, manteniendo el texto del enlace (ej: [Texto](url))
    plainText = plainText.replace(/\[(.*?)\]\(.*?\)/g, '$1');

    // Eliminar imágenes, manteniendo el texto alternativo (ej: ![Alt Text](url))
    plainText = plainText.replace(/!\[(.*?)\]\(.*?\)/g, '$1');

    // Eliminar marcadores de negrita y cursiva (simple eliminación)
    // Maneja *texto*, **texto**, _texto_, __texto__
    plainText = plainText.replace(/([*_]{1,2})(.*?)\1/g, '$2');
    // Elimina cualquier * o _ restante que no formara pares
    plainText = plainText.replace(/[*_]/g, '');


    // Reemplazar múltiples espacios en blanco (incluyendo saltos de línea creados por la eliminación) por un solo espacio
    plainText = plainText.replace(/\s+/g, ' ').trim();

    return plainText;
}


// Esta función se llama cuando la extensión se activa
export function activate(context: vscode.ExtensionContext) {

    console.log('La extensión "markdown-net-character-counter" está activa!');

    // Registra el comando para contar caracteres
    let disposable = vscode.commands.registerCommand('markdownNetCharacterCounter.countCharacters', () => {
        const editor = vscode.window.activeTextEditor; // Obtiene el editor activo

        if (editor) {
            const selection = editor.selection; // Obtiene la selección actual
            const selectedText = editor.document.getText(selection); // Obtiene el texto seleccionado

            if (selectedText.length > 0) {
                // Procesa el texto para eliminar la sintaxis Markdown
                const plainText = stripMarkdown(selectedText);

                // Cuenta los caracteres netos
                const netCharacterCount = plainText.length;

                // Muestra el resultado en la barra de estado
                vscode.window.setStatusBarMessage(`Caracteres netos (sin Markdown): ${netCharacterCount}`, 5000); // Muestra el mensaje por 5 segundos

            } else {
                // Si no hay texto seleccionado
                vscode.window.setStatusBarMessage('No hay texto seleccionado para contar.', 5000);
            }
        } else {
            // Si no hay un editor activo
            vscode.window.setStatusBarMessage('No hay un editor de texto activo.', 5000);
        }
    });

    // Añade el comando a las suscripciones del contexto para que se limpie al desactivar la extensión
    context.subscriptions.push(disposable);
}

// Esta función se llama cuando la extensión se desactiva
export function deactivate() {
    console.log('La extensión "markdown-net-character-counter" se ha desactivado.');
}
