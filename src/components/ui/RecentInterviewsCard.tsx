"use client";

interface Interview {
  _id: string;
  title: string;
  status: string;
  scheduledAt?: string;
  feedback?: string;
  interviewer?: string;
}

interface Props {
  interviews?: Interview[];
}

export default function RecentInterviewsCard({
  interviews = [],
}: Props): React.JSX.Element {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>
        Recent Interviews
      </h3>
      {interviews.length === 0 ? (
        <p style={{ color: "#6B7280", fontSize: 14 }}>
          No interviews scheduled yet.
        </p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {interviews.map((i) => (
            <li
              key={i._id}
              style={{ padding: "10px 0", borderBottom: "1px solid #F3F4F6" }}
            >
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{i.title}</p>
              <p style={{ margin: "2px 0", fontSize: 12, color: "#6B7280" }}>
                {i.status}
                {i.scheduledAt &&
                  ` · ${new Date(i.scheduledAt).toLocaleDateString()}`}
                {i.interviewer && ` · ${i.interviewer}`}
              </p>
              {i.feedback && (
                <p style={{ margin: "4px 0 0", fontSize: 12, fontStyle: "italic" }}>
                  {i.feedback}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
