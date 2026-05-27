import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { experienceTaskBlock, experienceYearLogs } from "./experienceLogs.data";
import "./experienceLogs.css";

export function ExperienceLogs() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="exp-logs">
      <div className="exp-logs__inner">
        <motion.div
          className="exp-logs__topline"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
        >
          <div className="exp-logs__line" />
          <div className="exp-logs__title">Experience // Career Logs</div>
          <div className="exp-logs__line" />
        </motion.div>

        <motion.div
          className="exp-logs__status"
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          [STATUS: FETCHING CAREER_LOGS... COMPLETE]
        </motion.div>

        <motion.div
          className="exp-logs__frame"
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="exp-logs__grid">
            <div className="exp-logs__left">
              <div className="exp-logs__timeline" aria-hidden />

              <div className="exp-logs__entries">
                {experienceYearLogs.map((log, index) => (
                  <motion.article
                    key={log.id}
                    className="exp-logs__entry"
                    initial={{ opacity: 0, x: -18 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.18 + index * 0.08 }}
                  >
                    <span
                      className={`exp-logs__node${
                        log.state === "complete" ? " exp-logs__node--complete" : ""
                      }${log.state === "active" ? " exp-logs__node--active" : ""}`}
                    />

                    <div
                      className={`exp-logs__year-card${log.state === "active" ? " exp-logs__year-card--active" : ""}`}
                    >
                      <div className="exp-logs__year-label">{log.yearLabel}</div>
                    </div>

                    <div className="exp-logs__bullet-card">
                      <ul className="exp-logs__bullet-list">
                        {log.bullets.map((bullet) => (
                          <li key={bullet} className="exp-logs__bullet-item">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>

            <div className="exp-logs__right">
              <motion.article
                className="exp-logs__detail"
                initial={{ opacity: 0, x: 24 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.2 }}
              >
                <div className="exp-logs__detail-head">
                  <div>
                    <div className="exp-logs__detail-title">Core Memory [Log_01]</div>
                    <div className="exp-logs__detail-subtitle">
                      Directory initialized: [alpha_ai_labs.sys]
                    </div>
                  </div>
                </div>

                <div className="exp-logs__detail-meta">
                  <div>
                    <strong>COMPANY:</strong> {experienceTaskBlock.company}
                  </div>
                  <div>
                    <strong>POSITION:</strong> {experienceTaskBlock.position}
                  </div>
                  <div>
                    <strong>TIMELINE:</strong> {experienceTaskBlock.timeline}
                  </div>
                </div>

                <div className="exp-logs__task-heading">[Executed Tasks]</div>
                <ul className="exp-logs__task-list">
                  {experienceTaskBlock.tasks.map((task) => (
                    <li key={task} className="exp-logs__task-item">
                      {task}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </div>
          </div>

          <div className="exp-logs__footer">Scroll To Traverse</div>
        </motion.div>
      </div>
    </section>
  );
}
