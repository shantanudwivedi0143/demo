import React, { useEffect, useState } from 'react';
import { Header, Hero, ContentGrid, Footer, styles, OurClient, Industries } from './components';
import ContactSection from './contactsection';
import { ContactForm } from './ContactForm';
import App1ferfaweft from './App';





function App() {

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringCity, setIsHoveringCity] = useState(false);


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  

  return (
    <div >
      <Header />

      <section id="learn">
  <div
    className="city-hover-area"
    onMouseEnter={() => setIsHoveringCity(true)}
    onMouseLeave={() => setIsHoveringCity(false)}
  >
    <App1ferfaweft />
  </div>
</section>


      <div style={styles.aboutContainer}>
          <div style={styles.imageContainer }>
            <img
              src="https://smiconline.com/wp-content/uploads/2024/01/civil-engineer-construction-worker-architects-wearing-hardhats-safety-vests-are-working-together-construction-site-building-home-cooperation-teamwork-concept-1536x1025.jpg"
              alt="About us"
              style={styles.imageabout2} 
            />
          </div>
          <div style={styles.textContainer}>
            <h2>Empowering Excellence Through Innovative Automation Solutions Globally.
            </h2>
            <p>
            At SM Informatics and Controls, we are industry leaders in automation solutions, empowering businesses through cutting-edge technology. Our commitment mirrors excellence, providing seamless operational solutions and fostering innovation for clients globally.
            </p>
            <h3>Quality material
            </h3>
            <p>
            Quality material refers to a type of material that is Superior in terms of durability,
            </p>
            <h3>Expert Engineer
            </h3>
            <p style={{marginTop:'1px'}}>
            Expert engineer is someone Who provides packet of material that is Superior in terms of durability,
            </p>
            <a href="#about"  style={styles.card23}>Kwon More</a>
          </div>
        </div>

      <section id="technology">
        <ContentGrid />
      </section>

      <div>
        <Industries/>
      </div>

      <section id="about" style={{ padding: '100px 20px', minHeight: '100vh', background: '#f5f5f5' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>About Us</h2>

        <div style={styles.aboutContainer}>
          <div style={styles.imageContainer}>
            <img
              src="https://smiconline.com/wp-content/uploads/2024/03/civil-engineer-construction-worker-manager-holding-digital-tablet-blueprints-talking-planing-about-construction-site-cooperation-teamwork-concept-scaled.jpg" // Replace with your actual image URL or import
              alt="About us"
              style={styles.aboutImage}
            />
          </div>
          <div style={styles.textContainer}>
            <h3>Precision, Efficiency, Automation: Your Digital Factory Partner.</h3>
            <p>
            Greetings from SM INFORMATICS & CONTROLS! We understand the pulse of the industry and recognize that staying at the forefront of technological advancements is crucial for sustained success. With over two decades of expertise in factory automation, we bring a wealth of experience to propel your business into the digital era.
            Our commitment is to enhance global well-being by fostering productivity and sustainability. We dedicate ourselves to empowering the evolution of intelligent manufacturing for the upcoming generation. Through a strategic vision, a team of skilled professionals, and robust financial capabilities, we pledge to provide meaningful value to our clientele.
            </p>
            <p>
              Our team is focused on creating user-friendly interfaces using React and modern technologies.
              We aim to deliver quality and simplicity in every component.
            </p>
          </div>
        </div>
        <div style={styles.textContainer}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' , fontSize:'28px'}}>Our Story</h2>
            <p>
            Our journey is defined by a relentless pursuit of excellence in merging traditional manufacturing with cutting-edge digital technologies. As seasoned technical experts, we comprehend the intricacies of your industry, and our extensive track record bears testimony to our commitment to innovation and efficiency.
At SM INFORMATICS & CONTROLS-“SMIC”, we don’t just embrace digital technologies; we harness them to revolutionize factory automation. Our team, comprised of individuals with deep technical acumen, has been at the forefront of the digital transformation wave. With a comprehensive understanding of the evolving landscape, we are well-positioned to guide your company through the dynamic shifts in the industry.
What sets us apart is not just our technical prowess, but our ability to tailor solutions to suit your unique challenges. From implementing advanced control systems to integrating IoT solutions, we leverage our 20 years of experience to drive operational excellence and elevate your manufacturing processes.
Partnering with SM INFORMATICS & CONTROLS means aligning with a team that understands the nuances of your industry, appreciates the complexities of your operations, and is dedicated to amplifying your success in the digital age. Let’s embark on a journey together, where your vision and our technical expertise converge to shape the future of factory automation.
We look forward to the opportunity to discuss how we can contribute to the continued success and innovation of SM INFORMATICS & CONTROLS.
            </p>
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' , fontSize:'28px'}}>Our Core Values</h2>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/inovation-1536x1024.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Innovation:</h2>
          <p>
          We foster a culture of continuous innovation, encouraging creative thinking and the exploration of new technologies to drive advancements in factory automation.
          </p>
        </div>
        </div>


        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/Customer-Centricity.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Customer-Centricity:</h2>
          <p>
          Our customers are at the heart of everything we do. We are dedicated to understanding their needs, exceeding expectations, and delivering solutions that contribute to their success.
          </p>
        </div>
        </div>


        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/Integrity-scaled.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Integrity:</h2>
          <p>
          We uphold the highest standards of integrity in all our interactions. Transparency, honesty, and ethical behavior guide our decisions and actions.
          </p>
        </div>
        </div>

        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/sustainiblity-scaled.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Sustainability:</h2>
          <p>
          We are committed to sustainable practices. Our solutions aim to optimize resource usage, reduce environmental impact, and contribute to the long-term well-being of our planet.
          </p>
        </div>
        </div>

        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/Collaboration-1536x1024.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Collaboration:</h2>
          <p>
          We believe in the power of collaboration. By working seamlessly with our clients, partners, and colleagues, we create synergies that lead to collective success.
          </p>
        </div>
        </div>

        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/explaining-sketch-1536x1024.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Excellence:</h2>
          <p>
          We strive for excellence in every aspect of our work. From product development to customer support, we set high standards to deliver quality and value consistently.
          </p>
        </div>
        </div>


        <li></li>
        <h1></h1>
        <h1></h1>
        <div style={styles.containerabout2}>
        <img src="https://smiconline.com/wp-content/uploads/2024/03/Adaptability-scaled.jpg" alt="About" style={styles.imageabout2} />
        <div style={styles.textCardabout2}>
          <h2>Adaptability:</h2>
          <p>
          In the ever-evolving landscape of digital technologies, we embrace change. Our agility and adaptability allow us to respond effectively to industry shifts and emerging trends.
          </p>
        </div>
        </div>

      </section>


      <section id="contact" style={{ padding: '100px 20px', minHeight: '100vh' }}>
        <ContactSection/>
      </section>


      <section id="Client" style={{ padding: '100px 20px', minHeight: '100vh' }}>
        <OurClient/>
      </section>
      
      <section id='Careers' style={{ padding: '100px 20px', minHeight: '100vh', background: '#e3e7fd' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' , fontSize:'38px' , fontFamily:'cursive' }}>Carrer at SMIC</h1>
      <div style={styles.aboutContainer }>
          <div style={styles.imageContainer}>
            <img
              src="https://smiconline.com/wp-content/uploads/2024/01/high-angle-measuring-tools-still-life.jpg" // Replace with your actual image URL or import
              alt="About us"
              style={styles.imageabout2}
            />
          </div>
          <div style={styles.textContainer}>
            <h3>Precision, Efficiency, Automation: Your Digital Factory Partner.</h3>
            <p>
            Our people are the backbone of any construction project, embodying the diverse skills, expertise, and dedication required to bring a vision to life. From skilled laborers and craftsmen to project managers and engineers, each individual plays a crucial role in the seamless execution of construction tasks. These professionals bring their unique talents and experiences to the job site, creating a dynamic and collaborative environment. Their commitment to safety, precision, and innovation ensures that projects are not only completed on time and within budget but also meet the highest standards of quality. Beyond technical proficiency, the construction industry thrives on the strong work ethic and teamwork of its people. Their ability to adapt to challenges, communicate effectively, and problem-solve on the fly is what transforms blueprints into tangible structures that shape our communities. In essence, the construction industry is as much about the strength of its people as it is about the materials and techniques they employ.
            </p>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '40px' , fontSize:'18px' ,marginTop : '80px' }}>
        A career in Information & Controls Technology (ICT) within the field of Semiconductor Manufacturing (SM) offers a dynamic and rewarding path for individuals seeking growth and innovation. As technology continues to advance at an unprecedented pace, the semiconductor industry plays a pivotal role in shaping the future. Professionals in this field are at the forefront of designing, developing, and optimizing the processes and controls that drive semiconductor manufacturing.
        </p>
        <p style={{ textAlign: 'center', marginBottom: '40px' , fontSize:'18px' ,marginTop : '20px' }}>
        In an ICT career within SM, individuals work on cutting-edge technologies that power electronic devices, from smartphones and computers to advanced medical equipment. The roles encompass a range of responsibilities, including designing and implementing control systems, developing software for automation, and optimizing manufacturing processes for efficiency and precision.
        Key aspects of a career in SM Information & Controls Technology include:
        </p>
        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        1. Advanced Technology Integration: Professionals in this field are involved in integrating the latest technologies into semiconductor manufacturing processes. This may include working with Industry 4.0 concepts, artificial intelligence, machine learning, and advanced robotics.
        </li>
        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        2. Process Optimization: Continuous improvement is a cornerstone of semiconductor manufacturing. ICT experts focus on optimizing processes to enhance efficiency, reduce costs, and ensure high-quality production.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        3. Automation and Robotics: As technology evolves, so does the level of automation in semiconductor manufacturing. Careers in ICT involve creating and implementing automation solutions, robotics, and smart manufacturing systems.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        4. Data Analysis and Analytics: Big data plays a crucial role in semiconductor manufacturing. ICT professionals analyze vast amounts of data to identify trends, predict maintenance needs, and improve overall system performance.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        5. Cybersecurity: With the increasing connectivity of manufacturing systems, ensuring the cybersecurity of these systems becomes paramount. Careers in ICT involve developing and implementing robust cybersecurity measures to protect sensitive information and maintain the integrity of manufacturing processes.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        6. Cross-Disciplinary Collaboration: ICT professionals work closely with engineers, physicists, and other experts to create interdisciplinary solutions. Effective collaboration is essential for overcoming complex challenges in semiconductor manufacturing.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        7. Career Growth Opportunities: The semiconductor industry is known for its rapid evolution, providing numerous opportunities for career growth. Professionals in ICT can advance into leadership roles, research and development, or even start their own ventures.
        </li>

        <li style={{marginLeft:'40px' ,marginRight : '40px' , marginTop : '40px'}}>
        A career in SM Information & Controls Technology is not only about staying current with technological advancements but also about contributing to the innovation that drives the semiconductor industry forward. Aspiring individuals in this field have the chance to be at the forefront of transformative technologies, making a significant impact on the global landscape.
        </li>

        <ContactForm/>
        
      </section>

      <Footer />

      {isHoveringCity && (
  <div
    className="custom-cursor"
    style={{
      top: `${mousePos.y}px`,
      left: `${mousePos.x}px`,
    }}
  >
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      className="rotating-text-circle"
    >
      <defs>
        <path
          id="circlePath"
          d="M50,50 m-35,0 a35,35 0 1,1 70,0 a35,35 0 1,1 -70,0"
        />
      </defs>
      <text fill="white" fontSize="9" fontWeight="bold">
        <textPath href="#circlePath" startOffset="0%">
          CLICK TO ENTER CITY • CLICK TO ENTER CITY •
        </textPath>
      </text>
    </svg>
  </div>
)}


    </div>
    
    
  );
}

export default App;
