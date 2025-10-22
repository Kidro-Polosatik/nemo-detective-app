import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes

# Настройки
BOT_TOKEN = "8356397867:AAGd9nita05gpGDkZWXVwJ81MoMeZbw9ynY"

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)


# --- ЕДИНСТВЕННАЯ КОМАНДА /start ---
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Отправляет единственную кнопку для запуска Mini App"""
    user = update.effective_user

    # URL твоего будущего Mini App (пока заглушка)
    web_app_url = "https://kidro-polosatik.github.io/nemo-detective-app/"  # ЗАМЕНИШЬ ПОТОМ

    # Единственная кнопка - запуск приложения
    keyboard = [
        [InlineKeyboardButton("🎮 ЗАПУСТИТЬ ДЕТЕКТИВ", web_app=WebAppInfo(url=web_app_url))]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    # Минимальное приветствие
    welcome_text = (
        f"🕵️ Привет, {user.first_name}!\n\n"
        "Готов раскрыть тайны вместе с *Неживым Детективом*?\n\n"
        "Нажми кнопку ниже чтобы начать расследование 👇"
    )

    await update.message.reply_text(
        welcome_text,
        reply_markup=reply_markup,
        parse_mode='Markdown'
    )


# --- ЗАПУСК БОТА ---
def main() -> None:
    application = Application.builder().token(BOT_TOKEN).build()

    # ТОЛЬКО ОДИН обработчик - команда /start
    application.add_handler(CommandHandler("start", start))

    application.run_polling()
    print("🕵️ Бот-лаунчер 'Неживой Детектив' запущен!")


if __name__ == '__main__':
    main()