import streamlit as st
import os
from dotenv import load_dotenv
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="AI Learning Platform",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .feature-card {
        background-color: #f0f2f6;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
        border-left: 4px solid #1f77b4;
    }
    .metric-card {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
    }
    .progress-bar {
        background-color: #e0e0e0;
        border-radius: 10px;
        padding: 3px;
    }
    .progress-fill {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 7px;
        height: 20px;
        transition: width 0.3s ease;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'user_data' not in st.session_state:
    st.session_state.user_data = {
        'name': '',
        'subject': '',
        'learning_style': '',
        'goals': [],
        'progress': {},
        'study_sessions': [],
        'quiz_scores': []
    }

if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

# Sidebar for user profile
with st.sidebar:
    st.title("🎓 AI Learning Platform")
    st.markdown("---")
    
    # User Profile Section
    st.subheader("👤 Student Profile")
    
    # Get user information
    user_name = st.text_input("Your Name", value=st.session_state.user_data['name'])
    if user_name != st.session_state.user_data['name']:
        st.session_state.user_data['name'] = user_name
    
    subject = st.selectbox(
        "Main Subject",
        ["Mathematics", "Science", "English", "History", "Computer Science", "Other"],
        index=0 if not st.session_state.user_data['subject'] else 
        ["Mathematics", "Science", "English", "History", "Computer Science", "Other"].index(st.session_state.user_data['subject'])
    )
    if subject != st.session_state.user_data['subject']:
        st.session_state.user_data['subject'] = subject
    
    learning_style = st.selectbox(
        "Learning Style",
        ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"],
        index=0 if not st.session_state.user_data['learning_style'] else 
        ["Visual", "Auditory", "Kinesthetic", "Reading/Writing"].index(st.session_state.user_data['learning_style'])
    )
    if learning_style != st.session_state.user_data['learning_style']:
        st.session_state.user_data['learning_style'] = learning_style
    
    # Learning Goals
    st.subheader("🎯 Learning Goals")
    new_goal = st.text_input("Add a new goal")
    if st.button("Add Goal") and new_goal:
        if 'goals' not in st.session_state.user_data:
            st.session_state.user_data['goals'] = []
        st.session_state.user_data['goals'].append(new_goal)
        st.rerun()
    
    # Display current goals
    if st.session_state.user_data['goals']:
        for i, goal in enumerate(st.session_state.user_data['goals']):
            col1, col2 = st.columns([3, 1])
            with col1:
                st.write(f"• {goal}")
            with col2:
                if st.button("Remove", key=f"remove_{i}"):
                    st.session_state.user_data['goals'].pop(i)
                    st.rerun()
    
    st.markdown("---")
    
    # Quick Stats
    st.subheader("📊 Quick Stats")
    if st.session_state.user_data['study_sessions']:
        total_study_time = sum(session['duration'] for session in st.session_state.user_data['study_sessions'])
        st.metric("Total Study Time", f"{total_study_time} minutes")
        
        if st.session_state.user_data['quiz_scores']:
            avg_score = sum(st.session_state.user_data['quiz_scores']) / len(st.session_state.user_data['quiz_scores'])
            st.metric("Average Quiz Score", f"{avg_score:.1f}%")

# Main content area
st.markdown('<h1 class="main-header">🎓 AI-Powered Learning Platform</h1>', unsafe_allow_html=True)

# Navigation tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs(["🏠 Dashboard", "🤖 AI Tutor", "📚 Study Materials", "📊 Progress", "⚙️ Settings"])

# Dashboard Tab
with tab1:
    st.header("Welcome to Your Personalized Learning Dashboard")
    
    if st.session_state.user_data['name']:
        st.subheader(f"Hello, {st.session_state.user_data['name']}! 👋")
    
    # Key Metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown("""
        <div class="metric-card">
            <h3>Study Sessions</h3>
            <h2>""" + str(len(st.session_state.user_data['study_sessions'])) + """</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="metric-card">
            <h3>Goals Set</h3>
            <h2>""" + str(len(st.session_state.user_data['goals'])) + """</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        total_time = sum(session['duration'] for session in st.session_state.user_data['study_sessions'])
        st.markdown(f"""
        <div class="metric-card">
            <h3>Total Study Time</h3>
            <h2>{total_time} min</h2>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        if st.session_state.user_data['quiz_scores']:
            avg_score = sum(st.session_state.user_data['quiz_scores']) / len(st.session_state.user_data['quiz_scores'])
            st.markdown(f"""
            <div class="metric-card">
                <h3>Avg Quiz Score</h3>
                <h2>{avg_score:.1f}%</h2>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class="metric-card">
                <h3>Avg Quiz Score</h3>
                <h2>N/A</h2>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Recent Activity
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📈 Recent Study Sessions")
        if st.session_state.user_data['study_sessions']:
            recent_sessions = st.session_state.user_data['study_sessions'][-5:]
            for session in recent_sessions:
                st.write(f"📚 {session['topic']} - {session['duration']} minutes ({session['date']})")
        else:
            st.info("No study sessions recorded yet. Start studying to see your progress!")
    
    with col2:
        st.subheader("🎯 Current Goals")
        if st.session_state.user_data['goals']:
            for goal in st.session_state.user_data['goals']:
                st.write(f"✅ {goal}")
        else:
            st.info("No goals set yet. Add some learning goals in the sidebar!")
    
    # AI Recommendations
    st.subheader("🤖 AI Learning Recommendations")
    
    if st.session_state.user_data['learning_style']:
        recommendations = {
            "Visual": [
                "Use mind maps and diagrams to organize concepts",
                "Watch educational videos and infographics",
                "Create visual flashcards with images",
                "Use color coding for different topics"
            ],
            "Auditory": [
                "Listen to educational podcasts and lectures",
                "Read aloud or discuss topics with others",
                "Use voice notes to record your understanding",
                "Participate in group discussions"
            ],
            "Kinesthetic": [
                "Use hands-on activities and experiments",
                "Take frequent breaks and move around",
                "Use physical objects to represent concepts",
                "Practice with real-world applications"
            ],
            "Reading/Writing": [
                "Take detailed notes and summaries",
                "Write essays and explanations",
                "Create written flashcards",
                "Read extensively on topics"
            ]
        }
        
        st.markdown("""
        <div class="feature-card">
            <h4>Based on your """ + st.session_state.user_data['learning_style'] + """ learning style:</h4>
        </div>
        """, unsafe_allow_html=True)
        
        for rec in recommendations[st.session_state.user_data['learning_style']]:
            st.write(f"💡 {rec}")

# AI Tutor Tab
with tab2:
    st.header("🤖 AI Tutor - Your Personalized Learning Assistant")
    
    # Chat interface
    st.subheader("💬 Chat with Your AI Tutor")
    
    # Display chat history
    for message in st.session_state.chat_history:
        if message['role'] == 'user':
            st.write(f"**You:** {message['content']}")
        else:
            st.write(f"**AI Tutor:** {message['content']}")
    
    # Chat input
    user_input = st.text_input("Ask your AI tutor anything:", key="chat_input")
    
    if st.button("Send") and user_input:
        # Add user message to history
        st.session_state.chat_history.append({
            'role': 'user',
            'content': user_input,
            'timestamp': datetime.now().isoformat()
        })
        
        # Generate AI response
        ai_response = generate_ai_response(user_input, st.session_state.user_data)
        
        st.session_state.chat_history.append({
            'role': 'assistant',
            'content': ai_response,
            'timestamp': datetime.now().isoformat()
        })
        
        st.rerun()
    
    # Quick action buttons
    st.subheader("🚀 Quick Actions")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("📚 Explain a Concept"):
            st.session_state.chat_history.append({
                'role': 'user',
                'content': "Can you explain a key concept from my subject?",
                'timestamp': datetime.now().isoformat()
            })
            ai_response = generate_ai_response("Can you explain a key concept from my subject?", st.session_state.user_data)
            st.session_state.chat_history.append({
                'role': 'assistant',
                'content': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            st.rerun()
    
    with col2:
        if st.button("❓ Generate Quiz"):
            st.session_state.chat_history.append({
                'role': 'user',
                'content': "Generate a quiz question for me to practice",
                'timestamp': datetime.now().isoformat()
            })
            ai_response = generate_ai_response("Generate a quiz question for me to practice", st.session_state.user_data)
            st.session_state.chat_history.append({
                'role': 'assistant',
                'content': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            st.rerun()
    
    with col3:
        if st.button("📖 Study Plan"):
            st.session_state.chat_history.append({
                'role': 'user',
                'content': "Create a personalized study plan for me",
                'timestamp': datetime.now().isoformat()
            })
            ai_response = generate_ai_response("Create a personalized study plan for me", st.session_state.user_data)
            st.session_state.chat_history.append({
                'role': 'assistant',
                'content': ai_response,
                'timestamp': datetime.now().isoformat()
            })
            st.rerun()

# Study Materials Tab
with tab3:
    st.header("📚 Study Materials")
    
    # Upload study materials
    st.subheader("📤 Upload Study Materials")
    uploaded_file = st.file_uploader("Choose a file", type=['txt', 'pdf'])
    
    if uploaded_file is not None:
        st.success(f"File uploaded: {uploaded_file.name}")
        
        # Simulate processing
        with st.spinner("Processing your study material..."):
            # In real implementation, this would use LangChain to process the document
            st.write("📄 Document Analysis Complete!")
            st.write("✅ Key concepts extracted")
            st.write("✅ Summary generated")
            st.write("✅ Quiz questions created")
    
    # Study session tracking
    st.subheader("⏱️ Track Study Session")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        topic = st.text_input("What did you study?")
    
    with col2:
        duration = st.number_input("Duration (minutes)", min_value=1, value=30)
    
    with col3:
        if st.button("📝 Record Session") and topic:
            new_session = {
                'topic': topic,
                'duration': duration,
                'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
                'timestamp': datetime.now().isoformat()
            }
            st.session_state.user_data['study_sessions'].append(new_session)
            st.success("Study session recorded!")
            st.rerun()

# Progress Tab
with tab4:
    st.header("📊 Learning Progress")
    
    if st.session_state.user_data['study_sessions']:
        # Study time chart
        st.subheader("📈 Study Time Over Time")
        
        # Create sample data for visualization
        dates = [session['date'] for session in st.session_state.user_data['study_sessions']]
        durations = [session['duration'] for session in st.session_state.user_data['study_sessions']]
        
        df = pd.DataFrame({
            'Date': dates,
            'Study Time (minutes)': durations
        })
        
        fig = px.line(df, x='Date', y='Study Time (minutes)', 
                     title='Study Time Trend')
        st.plotly_chart(fig, use_container_width=True)
        
        # Progress towards goals
        st.subheader("🎯 Goal Progress")
        if st.session_state.user_data['goals']:
            for goal in st.session_state.user_data['goals']:
                st.write(f"**{goal}**")
                progress = min(len(st.session_state.user_data['study_sessions']) * 10, 100)
                st.progress(progress / 100)
                st.write(f"{progress}% complete")
    
    # Quiz performance
    st.subheader("📝 Quiz Performance")
    
    # Simulate quiz taking
    if st.button("Take a Practice Quiz"):
        quiz_question = "What is the capital of France?"
        answer = st.radio(quiz_question, ["London", "Paris", "Berlin", "Madrid"])
        
        if st.button("Submit Answer"):
            if answer == "Paris":
                score = 100
                st.success("Correct! Great job!")
            else:
                score = 0
                st.error("Incorrect. The answer is Paris.")
            
            st.session_state.user_data['quiz_scores'].append(score)
            st.rerun()
    
    # Display quiz scores
    if st.session_state.user_data['quiz_scores']:
        st.write("Recent Quiz Scores:")
        for i, score in enumerate(st.session_state.user_data['quiz_scores'][-5:]):
            st.write(f"Quiz {i+1}: {score}%")

# Settings Tab
with tab5:
    st.header("⚙️ Settings")
    
    st.subheader("🔧 Platform Settings")
    
    # Theme selection
    theme = st.selectbox("Choose Theme", ["Light", "Dark", "Auto"])
    
    # Notification settings
    st.subheader("🔔 Notifications")
    email_notifications = st.checkbox("Email notifications", value=True)
    study_reminders = st.checkbox("Study reminders", value=True)
    
    # Data export
    st.subheader("📤 Export Data")
    if st.button("Export Learning Data"):
        # Create JSON export
        export_data = {
            'user_data': st.session_state.user_data,
            'chat_history': st.session_state.chat_history,
            'export_date': datetime.now().isoformat()
        }
        
        st.download_button(
            label="Download Data",
            data=json.dumps(export_data, indent=2),
            file_name=f"learning_data_{datetime.now().strftime('%Y%m%d')}.json",
            mime="application/json"
        )
    
    # Reset data
    st.subheader("🗑️ Reset Data")
    if st.button("Reset All Data"):
        st.session_state.user_data = {
            'name': '',
            'subject': '',
            'learning_style': '',
            'goals': [],
            'progress': {},
            'study_sessions': [],
            'quiz_scores': []
        }
        st.session_state.chat_history = []
        st.success("All data has been reset!")

# AI Response Generation Function
def generate_ai_response(user_input, user_data):
    """Generate AI responses based on user input and profile"""
    
    input_lower = user_input.lower()
    
    # Personalized responses based on user data
    if "explain" in input_lower or "concept" in input_lower:
        subject = user_data.get('subject', 'general')
        learning_style = user_data.get('learning_style', 'general')
        
        if subject == "Mathematics":
            if learning_style == "Visual":
                return "Let me explain this mathematical concept visually! 🎨\n\n**Algebraic Equations**\n\nThink of an equation like a balanced scale. When you have 2x + 5 = 13, imagine:\n\n⚖️ Left side: 2x + 5\n⚖️ Right side: 13\n\nTo solve, you need to keep the scale balanced:\n1. Subtract 5 from both sides: 2x = 8\n2. Divide both sides by 2: x = 4\n\nVisual tip: Draw the scale and show how each operation maintains balance!"
            else:
                return "Let me explain this mathematical concept! 📐\n\n**Algebraic Equations**\n\nAn equation is like a puzzle where you need to find the value of x.\n\nExample: 2x + 5 = 13\n\nStep 1: Isolate the variable (x)\n- Subtract 5 from both sides: 2x = 8\n\nStep 2: Solve for x\n- Divide both sides by 2: x = 4\n\n**Key Principle:** Whatever you do to one side, you must do to the other to keep the equation balanced!"
        
        elif subject == "Science":
            return "Let me explain this science concept! 🔬\n\n**The Scientific Method**\n\n1. **Observation** - Notice something interesting\n2. **Question** - Ask 'why' or 'how'\n3. **Hypothesis** - Make an educated guess\n4. **Experiment** - Test your hypothesis\n5. **Analysis** - Look at the results\n6. **Conclusion** - Decide if your hypothesis was correct\n\n**Example:** Why do plants grow toward light?\n- Hypothesis: Plants need light for photosynthesis\n- Test: Grow plants with and without light\n- Result: Plants with light grow better\n- Conclusion: Light is essential for plant growth!"
        
        else:
            return "I'd be happy to explain any concept! 📚\n\nTo give you the best explanation, could you tell me:\n1. What specific topic you'd like to learn about?\n2. What's your current understanding level?\n3. Do you prefer examples, definitions, or step-by-step explanations?\n\nI'll tailor my explanation to your learning style and make it engaging!"
    
    elif "quiz" in input_lower or "question" in input_lower:
        subject = user_data.get('subject', 'general')
        
        if subject == "Mathematics":
            return "Here's a math quiz question for you! 🧮\n\n**Question:** If a rectangle has a length of 8 units and a width of 6 units, what is its area?\n\n**Options:**\nA) 14 square units\nB) 28 square units\nC) 48 square units\nD) 56 square units\n\n**Hint:** Remember, area of a rectangle = length × width\n\nTake your time to think about it!"
        
        elif subject == "Science":
            return "Here's a science quiz question! 🔬\n\n**Question:** Which of the following is NOT a state of matter?\n\n**Options:**\nA) Solid\nB) Liquid\nC) Gas\nD) Energy\n\n**Hint:** Think about the three main states of matter and what energy is.\n\nWhat do you think the answer is?"
        
        else:
            return "Here's a general knowledge question! 🎯\n\n**Question:** What is the capital of France?\n\n**Options:**\nA) London\nB) Paris\nC) Berlin\nD) Madrid\n\nThis is a great way to test your knowledge!"
    
    elif "study plan" in input_lower or "plan" in input_lower:
        subject = user_data.get('subject', 'general')
        learning_style = user_data.get('learning_style', 'general')
        
        return f"Here's your personalized study plan! 📋\n\n**Subject:** {subject}\n**Learning Style:** {learning_style}\n\n**Weekly Study Plan:**\n\n**Monday & Wednesday:**\n- 30 minutes: Review previous concepts\n- 45 minutes: Learn new material\n- 15 minutes: Practice problems\n\n**Tuesday & Thursday:**\n- 30 minutes: Interactive exercises\n- 30 minutes: Quiz practice\n- 15 minutes: Note-taking\n\n**Friday:**\n- 60 minutes: Comprehensive review\n- 30 minutes: Self-assessment\n\n**Weekend:**\n- 30 minutes: Relaxed review\n- 15 minutes: Plan next week\n\n**Tips for your {learning_style} learning style:**\n- Take regular breaks\n- Use active learning techniques\n- Review material within 24 hours\n- Practice regularly\n\nWould you like me to adjust this plan based on your specific goals?"
    
    elif "help" in input_lower or "stuck" in input_lower:
        return "I'm here to help! 🤝\n\n**How I can assist you:**\n\n📚 **Learning Support:**\n- Explain difficult concepts\n- Provide step-by-step solutions\n- Give examples and analogies\n\n🎯 **Study Guidance:**\n- Create personalized study plans\n- Suggest learning strategies\n- Track your progress\n\n❓ **Practice:**\n- Generate quiz questions\n- Provide practice problems\n- Give feedback on answers\n\n📊 **Progress Tracking:**\n- Monitor your study sessions\n- Analyze your performance\n- Suggest improvements\n\n**Just ask me anything!** What would you like help with today?"
    
    else:
        return "I'm your AI learning assistant! 🤖\n\nI can help you with:\n\n📚 **Learning:** Explain concepts, provide examples, answer questions\n🎯 **Planning:** Create study plans, set goals, track progress\n❓ **Practice:** Generate quizzes, provide exercises, give feedback\n📊 **Analysis:** Review your performance, suggest improvements\n\nWhat would you like to work on today? Feel free to ask me anything about your studies!"

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: #666;'>
    <p>🎓 AI-Powered Learning Platform | Personalized Education for Every Student</p>
    <p>Built with Streamlit, LangChain, and OpenAI</p>
</div>
""", unsafe_allow_html=True) 