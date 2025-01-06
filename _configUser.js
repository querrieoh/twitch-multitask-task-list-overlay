// ==============================
// User Commands and Responses
// ==============================
/** @type {UserConfig} */
const _userConfig = {
  commands: {
    addTask: ["!task", "!add", "!añadir", "!ajouter", "!追加", "!додати"],
    editTask: ["!edit", "!editar", "!modifier", "!編集", "!редагувати"],
    finishTask: ["!done", "!hecho", "!terminé", "!完了", "!готово"],
    deleteTask: ["!delete", "!eliminar", "!supprimer", "!削除", "!видалити"],
    check: ["!check", "!comprobar", "!vérifier", "!チェック", "!перевірити"],
    help: ["!help", "!ayuda", "!aide", "!ヘルプ", "!допомога"],
    additional: ["!credit", "!crédito", "!crédit", "!クレジット", "!кредит"],
  },
  responseTo: {
    EN: {
      addTask: 'Task(s) "{message}" added!',
      editTask: 'Task "{message}" updated!',
      finishTask: 'Good job on completing task(s) "{message}"!',
      deleteTask: 'Task(s) "{message}" has been deleted!',
      deleteAll: "All of your tasks have been deleted!",
      check: 'Your current task(s) are: "{message}"',
      help: "Try using these commands - !task !edit !done !delete, !check",
      additional:
        "Jujoco is the creator of this bot, check out his Twitch at: https://www.twitch.tv/Jujoco_Dev",
      maxTasksAdded:
        "Maximum number of tasks reached, try deleting old tasks.",
      noTaskFound: "That task doesn't seem to exist, try adding one!",
      invalidCommand: "Invalid command: {message}. Try !help",
    },
    ES: {
      addTask: 'Tarea(s) "{message}" añadida(s)!',
      editTask: 'Tarea "{message}" actualizada!',
      finishTask: '¡Buen trabajo completando la(s) tarea(s) "{message}"!',
      deleteTask: 'La(s) tarea(s) "{message}" ha sido eliminada(s)!',
      deleteAll: "Todas tus tareas han sido eliminadas!",
      check: 'Tus tareas actuales son: "{message}"',
      help: "Prueba a usar estos comandos - !añadir !editar !hecho !eliminar, !comprobar",
      additional:
        "Jujoco es el creador de este bot, visita su Twitch en: https://www.twitch.tv/Jujoco_Dev",
      maxTasksAdded:
        "Número máximo de tareas alcanzado, intenta eliminar tareas antiguas.",
      noTaskFound: "Esa tarea no parece existir, ¡intenta añadir una!",
      invalidCommand: "Comando inválido: {message}. Prueba !help",
    },
    FR: {
      addTask: 'Tâche(s) "{message}" ajoutée(s)!',
      editTask: 'Tâche "{message}" mise à jour!',
      finishTask: 'Bon travail pour avoir terminé la tâche "{message}"!',
      deleteTask: 'La tâche "{message}" a été supprimée!',
      deleteAll: "Toutes vos tâches ont été supprimées!",
      check: 'Vos tâches actuelles sont: "{message}"',
      help: "Essayez d'utiliser ces commandes - !ajouter !modifier !terminé !supprimer, !vérifier",
      additional:
        "Jujoco est le créateur de ce bot, consultez son Twitch sur: https://www.twitch.tv/Jujoco_Dev",
      maxTasksAdded:
        "Nombre maximum de tâches atteint, essayez de supprimer les anciennes tâches.",
      noTaskFound:
        "Cette tâche ne semble pas exister, essayez d'en ajouter une!",
      invalidCommand: "Commande invalide: {message}. Essayez !help",
    },
    JP: {
      addTask: 'タスク "{message}" が追加されました!',
      editTask: 'タスク "{message}" が更新されました!',
      finishTask: 'タスク "{message}" を完了しました!',
      deleteTask: 'タスク "{message}" が削除されました!',
      deleteAll: "すべてのタスクが削除されました!",
      check: '現在のタスクは "{message}" です',
      help: "これらのコマンドを試してみてください - !追加 !編集 !完了 !削除, !チェック",
      additional:
        "Jujoco はこのボットの作成者です、彼の Twitch をチェックしてください: https://www.twitch.tv/Jujoco_Dev",
      maxTasksAdded:
        "最大タスク数に達しました、古いタスクを削除してみてください。",
      noTaskFound: "そのタスクは存在しないようです、追加してみてください!",
      invalidCommand: "無効なコマンド: {message}。!help を試してみてください",
    },
    UA: {
      addTask: 'Завдання "{message}" додано!',
      editTask: 'Завдання "{message}" змінено!',
      finishTask: 'Вітаю з виконанням завдання "{message}"!',
      deleteTask: 'Завдання "{message}" видалено!',
      deleteAll: "Всі твої завдання видалено!",
      check: 'Твої завдання наразі : "{message}"',
      help: "Спробуй такі команди -!додати !редагувати !готово !видалити !перевірити",
      additional:
        "Jujoco створив цей бот, глянь його стрім : https://www.twitch.tv/Jujoco_Dev",
      maxTasksAdded:
        "Додано максимальну кількість завдань. Спробуй видалити щось старе.",
      noTaskFound: "Це завдання не існує, спробуй додати нове!",
      invalidCommand: "Неправильна команда: {message}. Переглянь !команди",
    },
  },
};

export default _userConfig;

/**
 * @typedef {Object} UserConfig
 * @property {Object} commands - The available user commands
 * @property {string[]} commands.addTask - Commands to add a task
 * @property {string[]} commands.editTask - Commands to edit a task
 * @property {string[]} commands.finishTask - Commands to finish a task
 * @property {string[]} commands.deleteTask - Commands to delete a task
 * @property {string[]} commands.check - Commands to check tasks
 * @property {string[]} commands.help - Commands to display help
 * @property {string[]} commands.additional - Additional commands
 * @property {Object} responseTo - Responses based on languages
 * @property {Object} responseTo.EN - English responses
 * @property {string} responseTo.EN.addTask - Add task response
 * @property {string} responseTo.EN.editTask - Edit task response
 * @property {string} responseTo.EN.finishTask - Finish task response
 * @property {string} responseTo.EN.deleteTask - Delete task response
 * @property {string} responseTo.EN.deleteAll - Delete all tasks response
 * @property {string} responseTo.EN.check - Check tasks response
 * @property {string} responseTo.EN.help - Help response
 * @property {string} responseTo.EN.additional - Additional info response
 * @property {string} responseTo.EN.maxTasksAdded - Max tasks reached response
 * @property {string} responseTo.EN.noTaskFound - No task found response
 * @property {string} responseTo.EN.invalidCommand - Invalid command response
 * @property {Object} responseTo.ES - Spanish responses
 * @property {string} responseTo.ES.addTask
 * @property {string} responseTo.ES.editTask
 * @property {string} responseTo.ES.finishTask
 * @property {string} responseTo.ES.deleteTask
 * @property {string} responseTo.ES.deleteAll
 * @property {string} responseTo.ES.check
 * @property {string} responseTo.ES.help
 * @property {string} responseTo.ES.additional
 * @property {string} responseTo.ES.maxTasksAdded
 * @property {string} responseTo.ES.noTaskFound
 * @property {string} responseTo.ES.invalidCommand
 * @property {Object} responseTo.FR - French responses
 * @property {string} responseTo.FR.addTask
 * @property {string} responseTo.FR.editTask
 * @property {string} responseTo.FR.finishTask
 * @property {string} responseTo.FR.deleteTask
 * @property {string} responseTo.FR.deleteAll
 * @property {string} responseTo.FR.check
 * @property {string} responseTo.FR.help
 * @property {string} responseTo.FR.additional
 * @property {string} responseTo.FR.maxTasksAdded
 * @property {string} responseTo.FR.noTaskFound
 * @property {string} responseTo.FR.invalidCommand
 * @property {Object} responseTo.JP - Japanese responses
 * @property {string} responseTo.JP.addTask
 * @property {string} responseTo.JP.editTask
 * @property {string} responseTo.JP.finishTask
 * @property {string} responseTo.JP.deleteTask
 * @property {string} responseTo.JP.deleteAll
 * @property {string} responseTo.JP.check
 * @property {string} responseTo.JP.help
 * @property {string} responseTo.JP.additional
 * @property {string} responseTo.JP.maxTasksAdded
 * @property {string} responseTo.JP.noTaskFound
 * @property {string} responseTo.JP.invalidCommand
 * @property {Object} responseTo.UA - Ukrainian responses
 * @property {string} responseTo.UA.addTask
 * @property {string} responseTo.UA.editTask
 * @property {string} responseTo.UA.finishTask
 * @property {string} responseTo.UA.deleteTask
 * @property {string} responseTo.UA.deleteAll
 * @property {string} responseTo.UA.check
 * @property {string} responseTo.UA.help
 * @property {string} responseTo.UA.additional
 * @property {string} responseTo.UA.maxTasksAdded
 * @property {string} responseTo.UA.noTaskFound
 * @property {string} responseTo.UA.invalidCommand
 */

/**
 * Define the structure and default values for user responses and commands.
 * Allows easy addition of new languages and customization of command triggers.
 */

export default _userConfig;
